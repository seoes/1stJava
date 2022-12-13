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
        </div>
        <div id = header_title>
            WMM Login
          </div>
        <table>
            <tr>
                <td>ID</td>
                <td>
                    <input type="text" id = "userID" name="userID"  bind:value={userID} style= "width:270px; height:23px;" />
                </td>
            <tr>
                <td>NAME</td>
                <td>
                    <input type="text" id="userName" name="userName"  bind:value={userName} style= "width:270px; height:23px;" />
                </td>
            </tr>
            <tr>
                <td>EMAIL</td>
                <td>
                    <input type="text" id="userEmail" name="userEmail" bind:value={userEmail} style= "width:270px; height:23px;" />
                </td>
            </tr>
            <tr>
                <td>TEL</td>
                <td>
                    <input type="text" id="userTel" name="userTel"  bind:value={userTel} style= "width:270px; height:23px;" />
                </td>
            </tr>
            <tr>
                <td>PASSWORD</td>
                <td>
                    <input type="text" id="password" name="password"  bind:value={password} style= "width:270px; height:23px;" />
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="button"class="uk-button uk-button-default" on:click={submitInfo} id="account">회원가입</button>
                </td>
            </tr>
        </table>
    
    
    <style>
    #app {
    position: absolute;
    margin: 0 auto;
    width: 500px;
    height: 600px;
    left: 692px;
    top: 250px;
    background: #B9B9B9;
    opacity: 0.2;
    border-radius: 100px;
    z-index:0;
      }
    
    #header_title{
    position: relative;
    width: 530px;
    height: 200px;
    left: 800px;
    top: 200px;
    
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100;
    font-size: 30px;
    line-height: 30px;
    z-index: 2;
    color: #000000;
    }
    
    table {
    position: relative;
    width: 550px;
    height: 200px;
    left: 570px;
    top: 150px;
    }
    
    td {
          padding: 3 3px;
    }
    </style>
    
    
    
    