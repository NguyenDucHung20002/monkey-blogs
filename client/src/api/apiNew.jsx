import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

const apiGetUserFollow = async (username,typeFollow="followers") => {
  try {
    const res = await fetch(`${config.SERVER_HOST}/follow-profile/${username}/${typeFollow}`,{
      method:"get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
    return res;
  } catch (error) {
    console.log("error:", error);
  }
};

export{
  apiGetUserFollow,
}