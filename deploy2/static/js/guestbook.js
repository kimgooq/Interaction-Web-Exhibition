// import { axios } from "../node_modules/axios/index.js";

const input_user_tel = document.getElementById("user_tel");
const input_comment = document.getElementById("comment");
const btn = document.getElementById("btn");
const allComments = document.getElementById("allComments");
const totalCount = document.getElementById("total_count");
const commentLength = document.getElementById("comment_length");

// console.log(user_tel, comment, btn, allComments);

window.addEventListener("load", () => {
  get_comments();
});

const get_comments = async () => {
  try {
    const res = await axios.get("/api/comments/read");
    // console.log(res.data);
    showComments(res.data);
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener(
  "keyup",
  () => (commentLength.innerText = `(${input_comment.value.length}/150)`)
);

const showComments = (data) => {
  data.forEach((el) => {
    let listItem = document.createElement("li");
    listItem.innerHTML = `<div id="phone">${el.user_tel.slice(
      7,
      10
    )}X 님</div><div id="commnets"><p>${
      el.comment
    }</p></div><div id="time">${new Date(
      el.createdAt
    ).toLocaleDateString()} ${new Date(
      el.createdAt
    ).toLocaleTimeString()}</div>`;
    allComments.appendChild(listItem);
    totalCount.innerText = `총 방명록 수 : ${data.length}`;
  });
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (input_user_tel.value.length !== 11) {
    alert("전화번호는 - 기호 없이 11자리로 입력해주세요!");
  } else {
    const new_comment = {
      user_tel: input_user_tel.value,
      comment: input_comment.value,
    };
    post_comment(new_comment);
  }
});

const post_comment = async (new_comment) => {
  try {
    const res = await axios.post("/api/comment/write", new_comment);
    console.log(res.data);
    user_tel.value = "";
    comment.value = "";
    commentLength.innerText = `(0/150)`;
    while (allComments.hasChildNodes()) {
      allComments.removeChild(allComments.firstChild);
    }
    get_comments();
  } catch (err) {
    console.log(err);
  }
};
