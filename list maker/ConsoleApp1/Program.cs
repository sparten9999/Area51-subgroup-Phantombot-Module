using System;
using Rant;

namespace ConsoleApp1
{

    

    class Program
    {
        static void Main(string[] args)
        {
            var rant = new RantEngine();
            rant.LoadPackage("Rantionary-3.0.20.rantpkg");
            rant.Dictionary.IncludeHiddenClass("nsfw");

            Console.WriteLine("Press <Enter> to create a list of 1000 groups");
            Console.ReadKey(true);
            Console.Clear();

            var pgm = RantProgram.CompileString(@"[rs:1000;\n]{<adj> <adj> <noun.pl>}");
            var output = rant.Do(pgm);
            Console.WriteLine(output.Main);



            Console.ReadLine();
        }
    }
}
