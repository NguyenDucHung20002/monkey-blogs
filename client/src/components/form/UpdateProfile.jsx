
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components"; 
import {useForm, useWatch} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios"
const UpdateProfile = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const url = "http://localhost:8080/api/";
  const token =localStorage.getItem('token')
  const formData = new FormData();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageSrc({imageUrl,'avatar': selectedFile});
    }
  };
  const schema = yup.object({
    fullname:yup.string().required().min(3).max(50),
    bio:yup.string().max(160),
    about:yup.string()
  })

  const {register, handleSubmit, formState:{errors }, control ,setValue } = useForm({
    mode:"onChange",
    resolver: yupResolver(schema)
  })

  const usernameValue = useWatch({ control, name: 'fullname' });
  const bioValue = useWatch({ control, name: 'bio' });
  
  const onSubmitHandeler = async(values) => {
    formData.set('fullname', values.fullname);
    formData.set('bio', values.bio?values.bio:" ");
    formData.set('about', values.about?values.about:" ");
    if(imageSrc.avatar){
      formData.set('avatar', imageSrc.avatar);
    }

    const res= await axios.put(`${url}profile`,formData,{
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    if(res.data.success){
      console.log("success");
    }
  };

  useEffect(()=>{
    async function fetch(){
      const res= await axios.get(`${url}profile`,{
        headers:{
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }).catch((err)=>{
        console.log(err);
      })
      if(res.data.success){
        const profileUser = res.data.data.profile
        setImageSrc({...imageSrc,['imageUrl']:`http://localhost:8080/api/file/${profileUser.avatar}`})
        setValue('fullname',profileUser.fullname)
        profileUser?.bio && profileUser?.bio!=" "? setValue('bio',profileUser?.bio):""
        profileUser?.about && profileUser?.about!=" " ? setValue('about',profileUser?.about):""
      }
    }
    fetch();
  },[])
  return (<>
    <ProfileStyles>
      <div className="container">
        <h1>Profile information</h1>
        <div className="photo-container">
          <div className="photo-text">
            <p>Photo</p>
          </div>
          <div className="group-photo">
            <div className="upload-photo">
              <input  
                onChange={handleFileChange} 
                type="file" 
                accept="image/gif, image/jpeg, image/png" id="upl"
                // {...register('avatar')}
              /> 
              <button onClick={() => document.getElementById('upl').click()} className="upload">
                <img src={imageSrc?.imageUrl} alt="" />
              </button>
            </div>
            <div className="photo-context">
              <div className="group-btn">
                <button className="btn update">Update</button>
                <button className="btn remove">Remove</button>
              </div>
              <div className="rcm-text">
                <p>Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</p>
              </div>
            </div>
          </div>
          <form onSubmit={ (e) => e.preventDefault()} action="">
            <div className="input-group">
              <label htmlFor="input-name">Name*</label>
              <input type="text" id="input-name"  {...register('fullname')}/>
              <div className="input-bottom">
                <p className={errors.fullname ? "warning":""} >{errors.fullname ? errors.fullname?.message:"Appears on your Profile page, as your byline, and in your responses."}</p>
                <p className={usernameValue?.length>50 ?"warning":""}><span>{usernameValue ? usernameValue.length :"0"}</span>/50</p>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="input-bio">Bio</label>
              <input type="text" id="input-bio" {...register('bio')}/>
              <div className="input-bottom">
                <p className={errors.bio ? "warning":""}>{errors.bio ? errors.bio?.message:"Appears on your Profile and next to your stories."}</p>
                <p className={bioValue?.length>160 ?"warning":""}><span>{bioValue ? bioValue.length:"0"}</span>/160</p>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="input-about">AboutMe</label>
              <input type="text" id="input-about" {...register('about')}/>
              <div className="input-bottom">
                <p>{"Appears on your Profile and next to your stories."}</p>
                {/* <p className={bioValue?.length>160 ?"warning":""}><span>{bioValue ? bioValue.length:"0"}</span>/160</p> */}
              </div>
            </div>
          </form>
          <div className="group-btn-bottom">
            <button className="cancel">Cancel</button>
            <button type="submit" onClick={handleSubmit(onSubmitHandeler)} className="save">Save</button>
          </div>
        </div>
      </div>
    </ProfileStyles>

  </>)
};

export default UpdateProfile;


const ProfileStyles = styled.div`
  /* background-color: rgba(185, 184, 184, 0.1); */
  
  .container{
    padding: 25px 40px;
    max-width: 600px;
    background-color: white;
    color: #6B6B6B;
    margin: auto;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px;
    border-radius: 5px;
    .warning{
      color: red;
    }
    h1{
      font-weight: bold;
      font-size: 22px;
      color:black;
      margin: 0 0 30px 0;
    }
    .group-photo{
      display: flex;
      padding: 10px 0;
      .upload-photo{
        #upl{
          display: none;
        }
        .upload{
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .photo-context{
        margin-left: 20px;
        .group-btn{
          padding-bottom: 10px;
          .update{
            color: #1a8917;
            margin-right: 10px;
          }
          .remove{
            color: #C94A4A;
          }
        }
      }
    }
    .input-group{
      margin: 40px 0;
      input{
        width: 100%;
        border-bottom: 1px solid #afadad;
        &:focus{
          border-bottom: 1px solid #161616;
        }
      }
      .input-bottom{
        display: flex;
        justify-content: space-between;
        height: 20px;
        p{
          font-size: 14px;
          margin: 8px 0;
        }
      }
    }
    .group-btn-bottom{
      display: flex;
      justify-content: flex-end;
      button{
        margin-right: 10px;
        border-radius: 20px;
        transition: 0.5s;
      }
      .save{
        background-color: #1a8917;
        padding: 8px 28px ;
        color: white;
        &:hover{
          background-color: #1c791a;
        }
      }
      .cancel{
        padding: 8px 28px ;
        border: 1px solid #1a8917;
        color: #1a8917;
        &:hover{
          border: 1px solid #1c791a;
          color: #1c791a;
        }
      }
    }
  }
`