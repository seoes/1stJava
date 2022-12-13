<script type="text/javascript">
let userID;
let password;

 function gotoLogin ()
 {
  fetch("/addmember", {
    method : "POST",
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
            alert(`환영합니다!`);
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
  <div id="WWMLogin">
    WWM Login
  </div>

  <table>
    <div id="nameTag">아이디</div>
    <tr>
      <td id="tduserID">
        <input class="uk-input" type="text" id="userID"  bind:value={userID} size="30" style="border:0 solid black; background: #B9B9B9; width: 350px; height: 30px"/>
      </td>
    </tr>
    <br>
    <div id="nameTag">비밀번호</div>
    <tr>
      <td>
        <input class="uk-input" type="text" id="password"  bind:value={password} size="30" style="border:0 solid black; background: #B9B9B9; width: 350px; height: 30px"/>
      </td>
    </tr>
    <tr>
      <td id="tdButton" colspan="2">
        <button type="button" on:click={gotoLogin} id="login">로그인</button>
        <button><a
                href="../register"
                style= "
                color: black;
                font-weight: bold;
                text-decoration-line: none;
                "
                id="membership">회원가입</a></button>

      </td>
    </tr>
  </table>
</div>


<style>
  #app {
    margin: 0 auto;
    margin-top: 100px;
    border-radius: 100px;
    padding: 10px;
  }

  table, td {
    margin: 0 auto;
    margin-top: 60px;
  }

  #app > #WWMLogin {
    font-weight: bold;
    color: black;
    font-size: 40px;
    text-align: center;
  }
  
  td {
    font-weight: bold;
    font-size: 20px;
    color: black;
  }

  #app > table > #nameTag {
    color: black;
    font-weight: bold;
  }

  #app > table > tr > #tdButton{
    text-align: center;
    height: 200px;
  }

  #app > table > tr > td > #login {
    padding: 0;
    border: none;
    background: #b9b9b9;
    font-weight: bold;
    font-size: 20px;
    width: 150px;
    height: 40px;
    border-radius: 71.5px;
    margin-right: 30px;

  }
  #app > table > tr > td > button {
    border-radius: 71.5px;
    background: #b9b9b9;
    width: 150px;
    height: 40px;
    font-size: 20px;
    border: none
  }
</style>
