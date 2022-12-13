<script type="text/javascript">
let userID;
let password;

 function gotoLogin ()
 {
  fetch("/addmember", {
    type : "POST",
    body : { 
      id : userID,
      pwd : password
    }
  })
  .then(res => res.json())
    .then(result => {
            if (result === "") {
              alert("아이디 또는 비밀번호를 확인하세요.");
            userID = "";
            password = "";
            } else {
            sessionStorage.setItem("login", JSON.stringify(result));
            alert(`${result.userName}님 환영합니다!`);
            location.href = "/";
        }
      })
        .catch(error => {
          alert("실패");
          console.log(error);
          userID = "";
          password ="";
        })
 }
</script>

<div id="app">
  <table>
    <tr>
      <td>아이디</td>
      <td>
        <input type="text" id="userID" placeholder="아이디"  bind:value={userID} size="30" />
      </td>
    </tr>
    <tr>
      <td>비밀번호</td>
      <td>
        <input type="text" id="password" placeholder="비밀번호"  bind:value={password} size="30" />
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <button type="button"  on:click={gotoLogin} id="login">로그인</button>
        <a
                href="../register"
                style= "
                color: black;
                font-size: 1.0em;
                font-weight: bold;
                text-decoration-line: none;
                ">회원가입</a>

      </td>
    </tr>
  </table>
</div>


<style>
  #app {
    margin: auto;
    margin-top: 40px;
    width: 30%;
    border: 3px solid black;
    padding: 10px;
  }

  table, td {
    border: 1px solid black;
  }
</style>
