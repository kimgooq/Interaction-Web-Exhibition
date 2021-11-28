// import { axios } from "../node_modules/axios/index.js";

const input_user_tel = document.getElementById("user_tel");
const input_comment = document.getElementById("comment");
const btn = document.getElementById("btn");
const allComments = document.getElementById("allComments");

// console.log(user_tel, comment, btn, allComments);

window.addEventListener("load", () => {
    get_comments();
});

const get_comments = async() => {
    try {
        const res = await axios.get("/api/comments/read");
        // console.log(res.data);
        showComments(res.data);
    } catch (err) {
        console.log(err);
    }
};

const showComments = (data) => {
    data.forEach((el) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<div id="phone">${el.user_tel.slice(7,10)}X 님</div><div id="commnets"><p>${el.comment}</p></div><div id="time">2021-11-26 07:17</div>`;
        allComments.appendChild(listItem);
    });
};

btn.addEventListener("click", (e) => {
    e.preventDefault();
    const new_comment = {
        user_tel: input_user_tel.value,
        comment: input_comment.value,
    };
    post_comment(new_comment);
});

const post_comment = async(new_comment) => {
    try {
        const res = await axios.post("/api/comment/write", new_comment);
        console.log(res.data);
        user_tel.value = "";
        comment.value = "";
        while (allComments.hasChildNodes()) {
            allComments.removeChild(allComments.firstChild);
        }
        get_comments();
    } catch (err) {
        console.log(err);
    }
};