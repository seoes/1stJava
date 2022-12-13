

<script type="text/javascript">
    let userTel;
    let userID;
    let userEmail;
    let userName;
    let password;
    
    function submitInfo() {
        fetch("/addMember", {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({
                userID: userID,
                userName: userName,
                userEmail : userEmail,
                userTel : userTel,
                password : password
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                alert("가입되었습니다!");
                location.href="/";
            })
    }
    </script>



<div id="app">
    <div id="WWMLogin">
        WWM Membership
    </div>
    <table>
        <div id="nameTag">아이디</div>
        <tr>
            <td>
                <input class="uk-input" type="text" id = "userID" name="userID" bind:value={userID} size="30" style="border:0 solid black; background: #B9B9B9; width: 350px; height: 30px"/>
            </td>
        </tr>
        <br>
        <div id="nameTag">이름</div>
        <tr>
            <td>
                <input class="uk-input" type="text" id="userName" name="userName"  bind:value={userName} size="30" style="border:0 solid black; background: #B9B9B9; width: 350px; height: 30px"/>
            </td>
        </tr>
        <br>
        <div id="nameTag">전화번호</div>
        <tr>
            
            <td>
                <input class="uk-input" type="text" id="userTel" name="userTel" bind:value={userTel}  size="30" style="border:0 solid black; background: #B9B9B9; width: 350px; height: 30px"/>
            </td>
        </tr>
        <br>
        <div id="nameTag">이메일</div>
        <tr>
            <td>
                <input class="uk-input" type="text" id="userEmail" name="userEmail" bind:value={userEmail} size="30" style="border:0 solid black; background: #B9B9B9; width: 350px; height: 30px"/>
            </td>
        </tr>
        <br>
        <div id="nameTag">비밀번호</div>
        <tr>
            <td>
                <input class="uk-input" type="text" id="password" name="password" bind:value={password} size="30" style="border:0 solid black; background: #B9B9B9; width: 350px; height: 30px"/>
            </td>
        </tr>
        <tr>
            <td id="tdButton" colspan="2">
                <button type="button" on:click={submitInfo} id="account">회원가입</button>
            </td>
        </tr>
    </table>
</div>

<style>

#app {
	margin: 0 auto;
    margin-top: 50px;
    border-radius: 100px;
    padding: 10px;
}

table, td {
	margin: 0 auto;
    margin-top: 50px;
}

#app > #WWMLogin {
    font-weight: bold;
    color: black;
    font-size: 40px;
    text-align: center;
}

#app > table > #nameTag {
    color: black;
    font-weight: bold;
}

#app > table > tr > td {
    margin-bottom: 50px;
}

#app > table > tr > td > #account {
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

#app > table > tr > #tdButton{
    text-align: center;
    height: 130px;
  }
</style>




