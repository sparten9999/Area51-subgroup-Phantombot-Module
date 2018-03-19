/*
 * subsgroup.js
 *
 */
(function() {
    
    announce = false;       
    subgrouptoggle = $.getSetIniDbBoolean('subscribeHandler', 'subGroupToggle', true);
    subWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'subscriberWelcomeToggle', true);
    primeSubWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'primeSubscriberWelcomeToggle', true);
    reSubWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'reSubscriberWelcomeToggle', true);
    giftSubWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'giftSubWelcomeToggle', true);
    subName = 0;
    var subGroupCmdMode = 0;
    var cmdarg = '';
    wordsToSay = '';

    
    function checkToggles(){
    $.updateSubscribeConfig
    subWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'subscriberWelcomeToggle', true);
    primeSubWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'primeSubscriberWelcomeToggle', true);
    reSubWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'reSubscriberWelcomeToggle', true);
    giftSubWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'giftSubWelcomeToggle', true);
    
    }
    
        function sayFunction(wordsToSay) {
        checkToggles()
        $.consoleLn('toggles checked')
   if (subgrouptoggle === true && subWelcomeToggle === false && primeSubWelcomeToggle === false && reSubWelcomeToggle === false && primeSubWelcomeToggle === false && announce === true){
     
            $.say(wordsToSay);
        }
    }
 

    // new subs say welcome to group. old subs say welcome back to the
    function generateMessage(subName) {
        
            if ($.inidb.exists('SubGroups', subName)) { //if sub exists

                $.consoleLn(subName + ' ' + $.inidb.get('SubGroups', subName));
                var arrayOfWords = $.inidb.get('SubGroups', subName).split(',');
                $.consoleLn('sub group exists');
                arrayOfWords = arrayOfWords.join(' ')
                $.consoleLn('your group is ' + (arrayOfWords)); //say sub group


                sayFunction('@' + subName + ' Welcome back to the ' + arrayOfWords)

            } else {
                arrayList = $.readFile("./addons/subgroup/list.txt");
                listLines = arrayList.length;
                $.consoleLn(arrayList.length);
                lineNumber = $.randRange(1, listLines);
                lineIndexNumber = lineNumber - 1;

                if (arrayList[lineIndexNumber] == '') {
                    $.consoleLn('Out of Combos');
                    sayFunction('We are sorry there was probably thousands of groups possible and @' + subName + ' didnt get one')
                    return;
                }

                $.consoleLn(listLines + ' in file');
                $.consoleLn(lineNumber + ' line selected');

                $.consoleLn(arrayList[lineIndexNumber]);
                $.inidb.set('SubGroups', subName, arrayList[lineIndexNumber]);

                sayFunction('@' + subName + ' Welcome to the ' + arrayList[lineIndexNumber])
                arrayList.splice(lineIndexNumber, 1);

                if (arrayList.length == 0) {
                    $.consoleLn('no more Combos');
                    $.writeToFile('', "./addons/subgroup/list.txt", false);
                    return;
                }

                if (arrayList.length == 1) {
                    $.consoleLn('one combo left');
                    $.writeToFile(arrayList.join(), "./addons/subgroup/list.txt", false);
                }
                if (arrayList.length > 1) {
                    $.writeToFile(arrayList.join('\n'), "./addons/subgroup/list.txt", false);
                }



            }
        
    }


    //tell you your group
    function subGroupCommand(subName) {
        //subGroupCmdMode = 1; callign yourself
        // subGroupCmdMode = 2; for calling otherr people
        $.consoleLn(subName);
        if ($.inidb.exists('SubGroups', subName)) {

            $.consoleLn(subName + ' ' + $.inidb.get('SubGroups', subName));
            var arrayOfWords = $.inidb.get('SubGroups', subName).split(',');
            arrayOfWords = arrayOfWords.join(' ')
            $.consoleLn(arrayOfWords);

            if (subGroupCmdMode == 1) {
                sayFunction("@" + subName + " You are a member of the " + arrayOfWords)
            } else {
                sayFunction(subName + " is part of the " + arrayOfWords)
            }

        } else {
            if (subGroupCmdMode == 1) {
                $.consoleLn('you are not in a group');
                sayFunction('ahhhh... Poor thing... You are not in a group ;-;')
            } else {
                sayFunction(subName + " isn't in a group YET")
            }
        }
    }




    /*
     * @event twitchSubscriber
     */
   $.bind('twitchSubscriber', function(event) {
       var subscriber = event.getSubscriber();
       generateMessage(subscriber.toLowerCase())		
   });

    /*
     * @event twitchPrimeSubscriber
     */
    $.bind('twitchPrimeSubscriber', function(event) {
        var subscriber = event.getSubscriber();
        generateMessage(subscriber.toLowerCase())	
    });

    /*
     * @event twitchReSubscriber
     */
    $.bind('twitchReSubscriber', function(event) {
        var resubscriber = event.getReSubscriber();
        months = event.getMonths();
        generateMessage(resubscriber.toLowerCase())
    });

    /*
     * @event twitchSubscriptionGift
     */
    $.bind('twitchSubscriptionGift', function(event) {
        var gifter = event.getUsername();
            recipient = event.getRecipient();
            months = event.getMonths();
            tier = event.getPlan();
        generateMessage(recipient.toLowerCase())
    });

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argsString = event.getArguments(),
            args = event.getArgs(),
            action = args[0],
            planId;



        if (command.equalsIgnoreCase('subgrouptoggle')) {
            subgrouptoggle = !subgrouptoggle;
            $.consoleLn(subgrouptoggle);                      

            if ( subgrouptoggle == true){
            $.consoleLn( $.whisperPrefix(sender) + 'subgrouptoggle on')
            $.say($.whisperPrefix(sender) + 'Sub Groups will be announced  in full glory.')
            } else {    
            $.consoleLn($.whisperPrefix(sender) + 'subgrouptoggle off')
            $.say($.whisperPrefix(sender) + 'Sub Groups will not be announced  but will still be tracked.')
            }
          $.setIniDbBoolean('subscribeHandler', 'subGroupToggle', subgrouptoggle);

        }


        //fake sub 
        //if (command.equalsIgnoreCase('fakesub')) {
        //			$.consoleLn('fakesub command called');
        //        if (action === undefined) {          
        //			generateMessage(sender)          
        //        } else { 
        //		 cmdarg = action.toLowerCase();
        //		generateMessage(cmdarg)			
        //}}

        //tell you your group /subgroup
        if (command.equalsIgnoreCase('subgroup')) {
            $.consoleLn('subgroup command called');
            $.consoleLn(subGroupCmdMode);
            if (action === undefined) {
                subGroupCmdMode = 1;
                subGroupCommand(sender)
            } else {
                cmdarg = action.toLowerCase();
                subGroupCmdMode = 2;
                subGroupCommand(cmdarg)
            }
        }

        
        //for reroll
        if (command.equalsIgnoreCase('newsubgroup')) {
            $.consoleLn('newsubgroup command called');
            if (action === undefined) {
                sayFunction('Please try again with a username')
            } else {
                cmdarg = action.toLowerCase();
                $.consoleLn(cmdarg);
				if ($.inidb.exists('SubGroups', cmdarg)) {
					sayFunction("You thought your old group was trashy? What do you think about this one?")
				} 
                $.inidb.del('SubGroups', cmdarg);
				generateMessage(cmdarg)
            }
        }


        if (command.equalsIgnoreCase('subhelp')) {
            $.consoleLn('subhelp command called');
            sayFunction("!subgroup tells your group. !newsubgroup username - mod only. Do not use @")
        }




    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./handlers/subgroup.js', 'subgrouptoggle', 1);
  //    $.registerChatCommand('./handlers/subgroup.js', 'fakesub', 7); /////////////
        $.registerChatCommand('./handlers/subgroup.js', 'newsubgroup', 2);
        $.registerChatCommand('./handlers/subgroup.js', 'subgroup', 7);
        $.registerChatCommand('./handlers/subgroup.js', 'subhelp', 7);
        announce = true;
    });
})();