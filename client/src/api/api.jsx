import axios from "axios";
import { config } from "../utils/constants";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const apiAddComment = async (slug, parentCommentId, content, token) => {
  if ((!slug, !parentCommentId, !content, !token)) return;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/comment/${slug}`,
      {
        parentCommentId,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log("error:", error);
  }
};

const apiAddTopic = async (token, name) => {
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/topic`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast.success("Add successfully!", {
        pauseOnHover: false,
        delay: 300,
      });
      return true;
    }
  } catch (error) {
    if (error.response.status === 409)
      return toast.error(error.response.data.message, {
        pauseOnHover: false,
        delay: 500,
      });

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiDeleteArticle = async (token, slug) => {
  try {
    const res = await axios
      .delete(`${config.SERVER_HOST}/article/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return null;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiDeleteTopic = async (token, slug) => {
  try {
    const response = await axios.delete(`${config.SERVER_HOST}/topic/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      toast.success("Add successfully!", {
        pauseOnHover: false,
        delay: 500,
      });
      return true;
    }
  } catch (error) {
    if (error.response.status === 409)
      return Swal.fire("Deleted!", "Your post has been deleted.", "success");

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiFollowTopic = async (slug, token) => {
  const res = await axios
    .post(
      `${config.SERVER_HOST}/follow-topic/${slug}/follow-unfollow`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => {
      if (err.response.status == 404) {
        toast.error("Can not find topic!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    });
  if (res.data.success) {
    return true;
  }

  return false;
};

const apiFollowUser = async (userID, token) => {
  const res = await axios
    .post(
      `${config.SERVER_HOST}/follow-profile/${userID}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => {
      if (err.response.status == 404) {
        toast.error("Can not find user!", {
          pauseOnHover: false,
          delay: 500,
        });
      } else {
        toast.error("User banned!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    });
  if (res?.data.success) {
    return true;
  }
  return false;
};

const apiGetAllUser = async (token) => {
  if (!token) return;
  try {
    const response = await axios.get(`${config.SERVER_HOST}/user?limit=10 `, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
    console.log("response.data:", response);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

const apiGetArticle = async (slug) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/article/${slug} `, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

const apiGetArticleSkip = async (skipId, token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/?skip=${skipId}&limit=${5}`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiGetComment = async (slug, token) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/comment/${slug} `, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetCommentReplies = async (slug, parentCommentId) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/comment/${slug}/${parentCommentId}/replies `,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetMyFollowingTopics = async (token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/user/me/following/topics`,
      {
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data.data;
  } catch (error) {
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiGetNotification = async (token) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/notification/me/notify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetProfile = async (token, username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/profile/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetTopic = async (token, slug) => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/topic/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Topic not found!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

const apiGetTopicArticlesAmount = async (slug) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/topic/${slug}/articles/amount`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetTopicFollowersAmount = async (slug) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/topic/${slug}/followers/amount`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetTopics = async () => {
  try {
    const response = await axios.get(`${config.SERVER_HOST}/topic`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  } catch (error) {
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiGetUserBlogs = async (username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/article/${username}/all`, {})
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return [];
    }
    return res.data.articles;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiGetUserFollowings = async (username) => {
  try {
    const res = await axios
      .get(`${config.SERVER_HOST}/follow-profile/${username}/following`, {})
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return [];
    }
    return res.data.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMyArticleFollowing = async (token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/article/?feed=following`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiMyTopicsFollowing = async (token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/user/me/following/topics`,
      {
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiSuggestionTopics = async (token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/topic/me/suggestions`,
      {
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiSuggestionUsers = async (token) => {
  try {
    const response = await axios.get(
      `${config.SERVER_HOST}/user/me/suggestions`,
      {
        headers: {
          authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) return response.data;
  } catch (error) {
    console.log("error:", error);
    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiTopicsSearch = async (inputSearch) => {
  if (!inputSearch) return;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/article/topics`,
      {
        search: inputSearch,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiUnFollowUser = async (userID, token) => {
  const res = await axios
    .delete(`${config.SERVER_HOST}/follow-profile/${userID}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      if (err.response.status == 404) {
        toast.error("Can not find user!", {
          pauseOnHover: false,
          delay: 500,
        });
      } else {
        toast.error("User banned!", {
          pauseOnHover: false,
          delay: 500,
        });
      }
    });
  if (res?.data.success) {
    return true;
  }

  return false;
};

const apiUpdateArticle = async (token, slug, formData) => {
  try {
    const response = await axios.put(
      `${config.SERVER_HOST}/article/${slug}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.success) return true;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Post not found!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

const apiUpdateTopic = async (token, slug, name) => {
  try {
    const response = await axios.put(
      `${config.SERVER_HOST}/topic/${slug}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast.success("Add successfully!", {
        pauseOnHover: false,
        delay: 500,
      });
      return true;
    }
  } catch (error) {
    if (error.response.status === 409)
      return toast.error(error.response.data.message, {
        pauseOnHover: false,
        delay: 500,
      });

    toast.error("Some thing was wrong!", {
      pauseOnHover: false,
      delay: 500,
    });
  }
};

const apiUserSearch = async (inputSearch) => {
  if (!inputSearch) return;
  try {
    const response = await axios.post(
      `${config.SERVER_HOST}/user/search`,
      {
        search: inputSearch,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: false,
        delay: 500,
      });
    }
  }
};

const apiUpdateBan = async (token, userId, banType) => {
  if ((!token, !userId)) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/user/update/${userId}`,
      {
        banType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: true,
        delay: 300,
      });
    }
  }
};

const apiBanUser = async (token, userId, banType) => {
  if (!userId && !banType && !token) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/user/ban/${userId}`,
      {
        banType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: true,
        delay: 300,
      });
    }
  }
};

const apiLiftTheBan = async (token, userId) => {
  if (!userId && !token) return null;
  try {
    const response = await axios.patch(
      `${config.SERVER_HOST}/user/unban/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data) return response.data;
  } catch (error) {
    if (error.response.status == 404) {
      toast.error("Users empty!", {
        pauseOnHover: true,
        delay: 300,
      });
    }
  }
};

const apiUpdateProfile = async (token, formData) => {
  try {
    const res = await axios
      .patch(`${config.SERVER_HOST}/profile/me/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!res?.data.success) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiMuteUser = async (type = "post", token, userId) => {
  try {
    const data = await fetch(`${config.SERVER_HOST}/mute/${userId}`, {
      method: type,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });

    if (!data?.success) {
      console.log("apiMuteUser:", data.message);
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiBlockUser = async (type = "post", token, userId) => {
  try {
    const data = await fetch(`${config.SERVER_HOST}/block/${userId}`, {
      method: type,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });

    if (!data?.success) {
      console.log("apiBlockUser:", data.message);
      return false;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const apiReportUser = async (token, userId,reason,description) => {
  try {
    const res = await fetch(`${config.SERVER_HOST}/report-user/${userId}`,{
      method:"post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body:JSON.stringify({reason,description})
    }).then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
    return res;
  } catch (error) {
    console.log("error:", error);
  }
};
export {
  apiAddTopic,
  apiAddComment,
  apiBanUser,
  apiDeleteArticle,
  apiDeleteTopic,
  apiLiftTheBan,
  apiFollowTopic,
  apiFollowUser,
  apiGetAllUser,
  apiGetArticle,
  apiGetArticleSkip,
  apiGetComment,
  apiGetCommentReplies,
  apiGetMyFollowingTopics,
  apiGetNotification,
  apiGetProfile,
  apiGetTopic,
  apiGetTopicArticlesAmount,
  apiGetTopicFollowersAmount,
  apiGetTopics,
  apiGetUserBlogs,
  apiGetUserFollowings,
  apiMyArticleFollowing,
  apiMyTopicsFollowing,
  apiSuggestionTopics,
  apiSuggestionUsers,
  apiUnFollowUser,
  apiUpdateArticle,
  apiUpdateTopic,
  apiUpdateBan,
  apiUserSearch,
  apiTopicsSearch,
  apiUpdateProfile,
  apiMuteUser,
  apiBlockUser,

};
