using System;


namespace ConsoleApp1
{
    internal class ENV
    {
        private static string SetenviromentVariable()
        {
            string variablename = "Google_API";
            string variablevalue = "AIzaSyDA-GbcFjJNNLqEFteW3ic3l9s7zhpbKwA";

            Environment.SetEnvironmentVariable(variablename, variablevalue, EnvironmentVariableTarget.User);
            return Environment.GetEnvironmentVariable(variablename);

        }

        public static string GetenviromentVariable()
        {
            string variableret=SetenviromentVariable();
            return variableret;
        }



    }
}
