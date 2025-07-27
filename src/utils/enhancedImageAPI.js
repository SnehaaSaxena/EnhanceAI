import axios from 'axios';
const API_KEY="wx4h0k4y842m9vyyx";
const BASE_URL="https://techhk.aoscdn.com/"
const MAXIMUM_RETRIES=20;

export const enhancedImageAPI=async(file)=>{
  try{
    const taskId=await uploadImage(file);
    console.log("Image Upload Succesfully, Task id",taskId);

    //Polling for the task status as enhancedImageData func is taking time to fetch data
    const enhancedImageData=await PollForEnhancedImage(taskId);
    console.log("Enhanced Image Data", enhancedImageData);

    return enhancedImageData;
   
  }catch(error){
    console.log("Error enhancing image:", error.message);
  }
};


//code to upload image
///api/tasks/visual/scale --post
const uploadImage=async(file)=>{
    const formData=new FormData(); //FormData is a built-in JavaScript object in the browser that helps to send form-like data, including:Text(name, email),Files(images,PDFs,etc),mostly use it to upload something to a server,like an image. and Automatically sets Content-Type:multipart/form-data
    formData.append("image_file",file); //The .append() method adds data to the formData object. where "image-file" is key and file is value

    const {data}=await axios.post( //sending a POST request to the API endpoint
        `${BASE_URL}/api/tasks/visual/scale`,
        formData, //sending formData, which includes uploaded file
        {
         headers:{ //used to add additional information
           "Content-type":"multipart/form-data", //Axios usually handles this automatically with FormData,can remove this line
           "X-API-KEY":API_KEY,
        },
    }
);
   // return taskId; this uploadImage will return a taskid which will be sent to fetchEnhancedImage
   if(!data?.data?.task_id){ //Does data exist? If yes,does data.data exist? If yes, does data.data.task_id exist? 
     throw new Error("Failed to upload image!Task ID not found");
   }
   return data.data.task_id;
};


 //fetch enhanced image
 //  ///api/tasks/visual/scale/{task_id} --get
const fetchEnhancedImage=async(taskId)=>{
     const {data}=await axios.get(
      `${BASE_URL}/api/tasks/visual/scale/${taskId}`,
       {
        headers:{
           "X-API-KEY":API_KEY,
        },
       }
    );
    if(!data?.data){ 
     throw new Error("Failed to upload image!Task ID not found");
   }
    return data.data;
};

//Polling
const PollForEnhancedImage=async(taskId,retries=0)=>{
  const result=await fetchEnhancedImage(taskId);

  if(result.state === 4){
    console.log(`processing..(${retries}/${MAXIMUM_RETRIES})`);
  
  if(retries>=MAXIMUM_RETRIES){
    throw new Error("Max retries reached.Please try again later");
  }
  //wait for 2 sec
   await new Promise((resolve)=>setTimeout(resolve,2000));
   return PollForEnhancedImage(taskId,retries+1);
 }
  console.log("Enhanced Image Url:", result);
  return result;
};