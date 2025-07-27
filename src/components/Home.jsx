import React from "react";
import {useState} from "react";
import ImageUpload from "./ImageUpload";
import ImagePreview from "./ImagePreview";
import {enhancedImageAPI} from "../utils/enhancedImageAPI";

const Home=()=>{
  const [uploadImage, setUploadImage]=useState(null);
  const [enhancedImage, setEnhancedImage]=useState(null);
  const [loading,setloading]=useState(false);
  
  const UploadImageHandler=async (file)=>{
        // console.log(file);
        setUploadImage(URL.createObjectURL(file)); //This creates a temporary URL for the uploaded image file using URL.createObjectURL()
        setloading(true);
    try{
        //api call
        const enhancedURL=await enhancedImageAPI(file);
        console.log("enhancedURL response:", enhancedURL);
        setEnhancedImage(enhancedURL);
        setloading(false);
    }catch(error){
          console.log(error);
          alert("Error while enhancing the image.Please try again later");
     }
  };
 console.log(enhancedImage?.image);

  return(
        <>
          <ImageUpload UploadImageHandler={UploadImageHandler}/>
          <ImagePreview
            loading={loading}
            uploaded={uploadImage}
            enhanced={enhancedImage?.image}
          />
       </>
    );
};
export default Home;