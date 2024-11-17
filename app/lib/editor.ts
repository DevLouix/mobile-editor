import axios from 'axios';

interface MonacoModelContent {
  filePath: string;
  content: string;
}

export async function writeModelContentsToFile(monaco:any,apiUrl: string) {
  // Get all Monaco models (files) currently opened
  const models = monaco.editor.getModels();
  
  // Create an array to hold all the content of models
  const modelContents: MonacoModelContent[] = [];

  // Loop through each model and collect the file path and content
  models.forEach((model:any) => {
    modelContents.push({
      filePath: model.uri.path,  // The file path (URI) of the Monaco model
      content: model.getValue(), // The content of the model
    });
  });

  console.log(models,"from write");
  

  try {
    // Send collected content to the server for writing to files
    const response = await axios.post(apiUrl, {
      action: 'write',             // Action type (write action)
      files: modelContents        // Array of model contents
    });

    if (response.status === 200) {
      console.log('Files saved successfully.');
    } else {
      console.error('Failed to save files. Server responded with:', response.status);
    }
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}
