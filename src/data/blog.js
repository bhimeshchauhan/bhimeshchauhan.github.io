export default [
    {
        id: 1,
        author: "Bhimesh Chauhan",
        panelImage: "da0acHr41p8",
        title: "Learn and Understand Recursion in JavaScript",
        tagLine: "I’ll walk you through two popular JS recursion examples in 10 minutes so you can finally understand how recursion works in JavaScript.",
        dated: "12th January, 2020 - Boston, MA",
        description: [
            ['img', "https://cdn-images-1.medium.com/max/2000/1*DkkJtUJr6f4H0HXD_3A0sQ.jpeg"],
            ['h3', "What is Recursion?"],
            ['p', [
                ['em', "Recursion is simply when a function calls itself."],
            ]],
            ['p', [
                ['normal', "Lets jump right in and take a look at probably the most famous recursion example. This example returns the factorial of a supplied integer:"],
            ]],
            ['pre', [
                ['normal', 'function factorial(x) {'],
                ['br', 'br'],
                ['normal', '  if (x &lt; 0) return;'],
                ['br', 'br'],
                ['normal', '  if (x === 0) return 1;'],
                ['br', 'br'],
                ['normal', '  return x * factorial(x - 1);'],
                ['br', 'br'],
                ['normal', '}'],
                ['br', 'br'],
                ['br', 'br'],
                ['normal', 'factorial(3);'],
                ['br', 'br'],
                ['strong', '// 6'],
            ]],
            ['p', [
                ['strong', "Woah. It’s Okay if that makes no sense to you."],
                ['normal', "The important part is happening on line 4:"],
                ['code', "return x * factorial(x — 1);"],
                ['normal', ". As you can see, the function is actually calling itself again ("],
                ['code', "factorial(x-1)"],
                ['normal', "), but with a parameter that is one less than when it was called the first time. This makes it a recursive function."]
            ]],
            ['blockquote', "Before I break down that code example any further, it’s important you understand what factorials are."],
            ['p', [
                ['normal', "To get the factorial of a number you multiply that number by itself minus one until you reach the number one."]
            ]],
            ['p', [
                ['normal', "Example 1: The factorial of 4 is 4 * 3 * 2 * 1, or "],
                ['strong', "24"],
                ['normal', "."]
            ]],
            ['p', [
                ['normal','"Example 2: The factorial of 2 is just 2 * 1, or "'],
                ['strong', "2"],
                ['normal', "."]
            ]],
            ['p', [
                ['normal', "Awesome, now that our High School Math lesson is over, we can return to the good stuff!"]
            ]],
            ['hr', "hr"],
            ['h3', "The three key features of recursion"],
            ['p', [
                ['normal', "All recursive functions should have three key features:"]
            ]],
            ['h4', "A Termination Condition"],
            ['p', [
                ['normal', "Simply put: "],
                ['code', "if(something bad happend)[ STOP };"],
                ['normal', " The Termination Condition is our recursion fail-safe. Think of it like your emergency brake. It’s put there in case of bad input to prevent the recursion from ever running. In our factorial example, if"],
                ['code', "(x &lt; 0) return;"],
                ['normal', "is our termination condition. It’s not possible to factorial a negative number and thus, we don’t even want to run our recursion if a negative number is input."]
            ]],
            ['h4', "A Base Case"],
            ['p', [
                ['normal', "Simply put: "],
                ['code', "if(this happens) [ Yay! We're done };"],
                ['normal', " The Base Case is similar to our termination condition in that it also stops our recursion. But remember, the termination condition is a catch-all for bad data. Whereas the base case is the goal of our recursive function. Base cases are usually within an if statement. In the factorial example, if"],
                ['code', "(x === 0) return 1;"],
                ['normal', " is our base case. We know that once we’ve gotten x down to zero, we’ve succeeded in determining our factorial!"],
            ]],
            ['p', [
                ['normal', "Simply put: Our function calling itself. In the factorial example,"],
                ['code', "return x * factorial(x — 1);"],
                ['normal', " is where the recursion actually happens. We’re returning the value of the number x multiplied by the value of whatever"],
                ['code', "factorial(x-1)"],
                ['normal', "evaluates to."]
            ]]
        ]
    }
];
