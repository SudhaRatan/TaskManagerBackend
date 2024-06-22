import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const systemInstruction = `I have an app to add a category, in category we can add tasks and in each task we can add multiple subtasks and a destription of the task.
Category has attributes [id, title], task has attributes [id,title,description,reminder, category_id], subtask has attributes [id,title,task_id].
The methods to add categories are: addCategory(title: String), addCategories(categories: Array<String>).
The methods to add tasks are: addTask(title: String, category_id: String), addTasks(categories: Array<(title: String, category_id: String)>).
The methods to add subtasks are: addSubTask(title: String, task_id: String), addTasks(categories: Array<(title: String, task_id: String)>).
All the "id" attributes are auto generated and all other fields are mandatory, add reminder only if the user specifies a date or/and time then convert it into datetime object for javascript to interpret it easily, today's date will be provided at the end of the query that is just for your information set by me for your use, do not add reminder unless user specifies any date and/or time ,do not add subtask unless specified, try to add description if a task is specified.
You will be prompted by the user. The user usually prompts to create single or multiple categories/tasks/subtasks, create only those which are mentioned by the user. If nothing is specified then assume the prompt is a task.Do not assume on your own. Do not create category unless it is specified by the user.
Please turn them into json instructions return only json object and nothing else so that my code can do those operations.
Here is the json instruction structure: [ { name: "category|task|subtask", type: "single|multiple", data: "attributes provided earlier which is processed from user prompt" } ]`;

const si = `I have an app to add a category, in category we can add tasks and in each task we can add multiple subtasks and a destription of the task.
Category has attributes [id, title], task has attributes [id,title,description,reminder, category_id], subtask has attributes [id,title,task_id].
The methods to add categories are: addCategory(title: String), addCategories(categories: Array<String>).
The methods to add tasks are: addTask(title: String, category_id: String), addTasks(categories: Array<(title: String, category_id: String)>).
The methods to add subtasks are: addSubTask(title: String, task_id: String), addTasks(categories: Array<(title: String, task_id: String)>).
All the "id" attributes are auto generated and all other fields are mandatory, add reminder only if the user specifies a date or/and time then convert it into datetime object for javascript to interpret it easily, today's date will be provided at the end of the query that is just for your information set by me for your use, do not add reminder unless user specifies any date and/or time ,do not add subtask unless specified, try to add description if a task is specified.
You will be prompted by the user. The user usually prompts to create single or multiple categories/tasks/subtasks, create only those which are mentioned by the user. If nothing is specified then assume the prompt is a task.Do not assume on your own. Do not create category unless it is specified by the user.
Please turn them into json instructions return only json object and nothing else so that my code can do those operations.
Here is the json instruction structure: {name:"category|task|subtask", type: "single|multiple", data:[{'attributes of "category|task|subtask" depending on name'}]}
data structure can be like this:
Category: { title, tasks:[("based on user input if user wants tasks")] }
Task: {title,description,reminder, subtasks:[("based on user input if user wants to add subtasks")]}`;

export async function search(prompt) {
  var d = new Date();
  d = d.toDateString();
  try {
    const result = await model.generateContent({
      systemInstruction: si,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${prompt}.## Today's Date: ${d}`,
            },
          ],
        },
      ],
    });
    console.log(result.response.text());
    return result.response.text();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function searchWithAudio({ audio }) {
  var d = new Date();
  d = d.toDateString();
  try {
    const result = await model.generateContent({
      systemInstruction: si,
      contents: [
        {
          role: "user",
          parts: [
            // {
            //   text: `${prompt}.## Today's Date: ${d}`,
            // },
            {
              inlineData: {
                data: audio,
                mimeType: "audio/webm",
              },
            },
          ],
        },
      ],
    });
    console.log(result.response.text());
    return result.response.text();
  } catch (error) {
    console.log(error);
    return null;
  }
}
