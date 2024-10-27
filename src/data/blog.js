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
    },
    {
        id: 2,
        author: "Bhimesh Chauhan",
        panelImage: "YKW0JjP7rlU",
        title: "Implementing Retrieval-Augmented Generation (RAG) with LLMs",
        tagLine: "In this post, we’ll explore how RAG enhances Large Language Models (LLMs) by integrating real-time data retrieval, using simple examples to illustrate the process.",
        dated: "22th July, 2024 - Toronto, CA",
        description: [
            ['img', "https://cdn-images-1.medium.com/v2/resize:fit:4000/format:webp/1*nsCTjifxfS_fTm9_lx_AuA.png"],
            ['h3', "What is Retrieval-Augmented Generation (RAG)?"],
            ['p', [
                ['em', "RAG combines the power of LLMs with external knowledge retrieval."],
            ]],
            ['p', [
                ['normal', "Instead of relying entirely on pre-trained knowledge, RAG retrieves relevant information from a connected source (like a database or API) and augments the response of the LLM in real-time."],
            ]],
            ['pre', [
                ['normal', 'async function getAnswer(query) {'],
                ['br', 'br'],
                ['normal', '  const documents = await retrieveRelevantDocs(query);'],
                ['br', 'br'],
                ['normal', '  const prompt = buildPrompt(query, documents);'],
                ['br', 'br'],
                ['normal', '  return await llm.generate(prompt);'],
                ['br', 'br'],
                ['normal', '}'],
                ['br', 'br'],
                ['br', 'br'],
                ['normal', 'getAnswer("What are the symptoms of diabetes?");'],
                ['br', 'br'],
                ['strong', '// Returns accurate and current medical information']
            ]],
            ['p', [
                ['strong', "This method helps overcome some limitations of LLMs."],
                ['normal', " LLMs may not have up-to-date information, but with RAG, the model retrieves data on-the-fly from external sources to enhance the response."]
            ]],
            ['blockquote', "Let’s dive deeper into why RAG is useful and how it complements LLMs."],
            ['p', [
                ['normal', "Think of RAG as a way to keep the LLM's answers accurate and relevant even after the model has been deployed."]
            ]],
            ['p', [
                ['normal', "Example 1: A legal advice chatbot retrieves the latest regulations to provide accurate responses."],
            ]],
            ['p', [
                ['normal', "Example 2: A medical assistant fetches recent journal publications when asked about new treatments."],
            ]],
            ['p', [
                ['normal', "These examples show how RAG ensures that AI applications stay relevant in dynamic fields."],
            ]],
            ['hr', "hr"],
            ['h3', "How Does RAG Work?"],
            ['p', [
                ['normal', "RAG involves three main components:"]
            ]],
            ['h4', "1. Query and Document Retrieval"],
            ['p', [
                ['normal', "When a user makes a request, the query is sent to a document store or external API to retrieve relevant data. Think of it as searching through a library to find the best books for your topic."]
            ]],
            ['h4', "2. Augmenting the Prompt"],
            ['p', [
                ['normal', "The retrieved documents are embedded into the LLM prompt, enhancing its response with external knowledge. This step ensures the response is not just based on the model's pre-trained data."],
                ['code', "const prompt = buildPrompt(userQuery, retrievedDocs);"],
            ]],
            ['h4', "3. Generating the Response"],
            ['p', [
                ['normal', "Finally, the LLM generates a response based on the augmented prompt, producing accurate and contextual answers."],
                ['code', "return llm.generate(prompt);"],
            ]],
            ['p', [
                ['normal', "RAG ensures that the model provides fact-based answers, even when it didn’t originally know the information."]
            ]],
            ['blockquote', "The retrieval step ensures that the AI isn't guessing or 'hallucinating' answers."],
            ['p', [
                ['normal', "Example: Instead of relying on old data, a travel assistant fetches live flight statuses to assist users."]
            ]],
            ['p', [
                ['normal', "This prevents outdated information from slipping through."]
            ]],
            ['hr', "hr"],
            ['h3', "Applications of RAG with LLMs"],
            ['p', [
                ['normal', "Here are some common use cases where RAG with LLMs shines:"]
            ]],
            ['h4', "Customer Support Bots"],
            ['p', [
                ['normal', "Bots can fetch relevant knowledge base articles to solve user queries faster and more accurately."]
            ]],
            ['h4', "Medical Assistants"],
            ['p', [
                ['normal', "LLMs with RAG integration pull the latest medical research to provide informed recommendations during consultations."]
            ]],
            ['h4', "Legal Research"],
            ['p', [
                ['normal', "A legal AI assistant retrieves recent case law or statutes to answer complex legal questions accurately."]
            ]],
            ['hr', "hr"],
            ['h3', "Benefits of RAG"],
            ['p', [
                ['strong', "1. Real-time Relevance:"],
                ['normal', " Ensures that responses are always up-to-date with the latest information."]
            ]],
            ['p', [
                ['strong', "2. Reduced Hallucination:"],
                ['normal', " By grounding responses in real data, it minimizes the chances of incorrect or fabricated answers."]
            ]],
            ['p', [
                ['strong', "3. Enhanced Utility:"],
                ['normal', " Makes LLMs suitable for use in dynamic environments like healthcare, finance, and law."]
            ]],
            ['p', [
                ['normal', "With RAG, applications powered by LLMs are more powerful, accurate, and trustworthy."]
            ]]
        ]
    },
    {
        id: 3,
        author: "Bhimesh Chauhan",
        panelImage: "XttrC5E0HDM",
        title: "Fine-Tuning LLMs for Domain-Specific Applications",
        tagLine: "In this blog, I’ll walk you through the basics of fine-tuning LLMs and explain the steps required to make them more effective for specific tasks.",
        dated: "14th September, 2024 - Toronto, CA",
        description: [
            ['img', "https://cdn-images-1.medium.com/max/2000/1*2mzg61san4ffmVmN_0fP_Q.png"],
            ['h3', "What is Fine-Tuning?"],
            ['p', [
                ['em', "Fine-tuning involves adjusting the parameters of a pre-trained language model on new, specialized data."],
            ]],
            ['p', [
                ['normal', "Pre-trained models like GPT or BERT are trained on large datasets containing general information, but they may not perform well on niche topics like medical diagnoses or legal cases. Fine-tuning helps tailor these models to excel in specific domains."],
            ]],
            ['pre', [
                ['normal', 'const fineTuneModel = async (dataset) => {'],
                ['br', 'br'],
                ['normal', '  const model = await loadPretrainedModel("gpt-3.5-turbo");'],
                ['br', 'br'],
                ['normal', '  model.train(dataset, { epochs: 5 });'],
                ['br', 'br'],
                ['normal', '  return model;'],
                ['br', 'br'],
                ['normal', '};'],
                ['br', 'br'],
                ['normal', 'const medicalModel = fineTuneModel(medicalData);'],
                ['br', 'br'],
                ['strong', '// Model fine-tuned on medical notes'],
            ]],
            ['p', [
                ['strong', "Fine-tuning helps overcome generalization issues."],
                ['normal', " When LLMs are fine-tuned, they become more focused and relevant for specific queries, improving their performance on tasks related to the target domain."]
            ]],
            ['blockquote', "Let’s dive deeper into why fine-tuning matters for real-world use cases."],
            ['p', [
                ['normal', "Think of fine-tuning as adjusting a generic recipe to suit your specific taste. You retain the original recipe's structure but make changes to align with your personal preferences."]
            ]],
            ['p', [
                ['normal', "Example 1: A financial assistant chatbot fine-tuned on recent market trends can provide better advice compared to a general-purpose model."],
            ]],
            ['p', [
                ['normal', "Example 2: A customer support bot tailored to your business responds accurately to common issues and inquiries, reducing response time and improving customer satisfaction."],
            ]],
            ['hr', "hr"],
            ['h3', "How to Fine-Tune an LLM?"],
            ['p', [
                ['normal', "Fine-tuning can be broken down into a few key steps:"]
            ]],
            ['h4', "1. Data Preparation"],
            ['p', [
                ['normal', "Collect and clean your dataset. Ensure the text is properly formatted and labeled if necessary. For example, if you're fine-tuning on medical notes, each record should contain consistent terminology and structure."]
            ]],
            ['h4', "2. Model Loading"],
            ['p', [
                ['normal', "Start by loading a pre-trained model, like GPT or BERT, from a model hub or library."],
                ['code', "const model = await loadPretrainedModel('bert-base');"]
            ]],
            ['h4', "3. Training the Model"],
            ['p', [
                ['normal', "Feed your specialized data into the model using your preferred framework (e.g., PyTorch, TensorFlow). Make sure to adjust hyperparameters, like the learning rate, to avoid overfitting."],
                ['code', "model.train(data, { batchSize: 16, epochs: 3 });"]
            ]],
            ['h4', "4. Evaluating and Fine-Tuning"],
            ['p', [
                ['normal', "Evaluate the fine-tuned model's performance using metrics like accuracy or F1-score. Continue adjusting the parameters as needed."]
            ]],
            ['blockquote', "Remember: A good fine-tuning process requires careful evaluation to ensure the model generalizes well to unseen data."],
            ['hr', "hr"],
            ['h3', "Applications of Fine-Tuning"],
            ['p', [
                ['normal', "Fine-tuning LLMs opens up a world of possibilities:"]
            ]],
            ['h4', "Healthcare"],
            ['p', [
                ['normal', "A fine-tuned LLM can assist doctors by summarizing patient records and providing recommendations based on the latest research."]
            ]],
            ['h4', "Finance"],
            ['p', [
                ['normal', "In the finance industry, LLMs fine-tuned on stock data can generate accurate reports and forecasts."]
            ]],
            ['h4', "Legal Advice"],
            ['p', [
                ['normal', "LLMs trained on legal documents can assist in drafting contracts and answering legal questions with precise language."]
            ]],
            ['hr', "hr"],
            ['h3', "Key Benefits of Fine-Tuning"],
            ['p', [
                ['strong', "1. Increased Accuracy:"],
                ['normal', " Models become more reliable for specific tasks and queries."]
            ]],
            ['p', [
                ['strong', "2. Faster Response:"],
                ['normal', " Tailored models provide answers more efficiently, improving user satisfaction."]
            ]],
            ['p', [
                ['strong', "3. Reduced Hallucination:"],
                ['normal', " By focusing on relevant data, fine-tuned models are less likely to produce misleading information."]
            ]],
            ['p', [
                ['normal', "Fine-tuning is essential for LLMs to reach their full potential in real-world applications."]
            ]]
        ]
    }
];
