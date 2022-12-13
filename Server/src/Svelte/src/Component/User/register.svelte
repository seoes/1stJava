

<script type="text/javascript">
let userTel;
let userID;
let userEmail;
let userName;
let password; 

function submitInfo() {
    fetch("/addMember", {
        type: "POST",
        body: {
            userID: userID,
            userName: userName,
            userEmail : userEmail,
            userTel : userTel,
            password : password
        }
    })
    .then(res => res.json())
    .then(result => {
        alert('success')
            if (result.trim() == 'ok') {
                console.log(response);
                alert("가입되었습니다!");
                location.href="../login";
            } else {
                alert("가입되지 않았습니다!");
                console.log(response);
                userID = "";
                userName ="";
                userEmail = "";
                userTel = "";
                password ="";
            }
        })
        .catch(error => {
          alert("실패");
          console.log(error);
           password ="";
        })
    }
</script>



<div id="app">
    <table>
        <tr>
            <td>아이디</td>
            <td>
                <input type="text" id = "userID" name="userID" placeholder="아이디" bind:value={userID} size="30" />
            </td>
        <tr>
            <td>이름</td>
            <td>
                <input type="text" id="userName" name="userName" placeholder="이름" bind:value={userName} size="30" />
            </td>
        </tr>
        <tr>
            <td>전화번호</td>
            <td>
                <input type="text" id="userTel" name="userTel" placeholder="전화번호" bind:value={userTel}  size="30" />
            </td>
        </tr>
        <tr>
            <td>이메일</td>
            <td>
                <input type="text" id="userEmail" name="userEmail" placeholder="이메일 주소" bind:value={userEmail} size="30" />
            </td>
        </tr>
        <tr>
            <td>비밀번호</td>
            <td>
                <input type="text" id="password" name="password" placeholder="비밀번호" bind:value={password} size="30" />
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <button type="button" on:click={submitInfo} id="account">회원가입</button>
            </td>
        </tr>
    </table>
</div>

<style>

#app {
	margin: auto;
	margin-top: 40px;
	width: 50%;
	border: 3px solid black;
	padding: 10px;
}

table, td {
	border: 1px solid black;
}

</style>




