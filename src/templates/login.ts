// src/templates/login.ts

/**
 * Login module templates
 */
export const loginFormTemplate = (token: string) => `
<div class="login-module">
  <h1>Log In</h1>
  
  <div class="login-form">
    <form id="login-form">
      <div class="form-group">
        <label for="name">Username or Email:</label>
        <input type="text" id="name" name="name" class="form-control" placeholder="Username or email address">
      </div>
      
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" class="form-control" placeholder="Password">
      </div>
      
      <div class="options">
        <label>
          <input type="checkbox" name="keepLogged" checked> 
          Keep me logged in
        </label>
        <label>
          <input type="checkbox" name="bindIP"> 
          Bind to IP
        </label>
      </div>
      
      <input type="hidden" name="token7" value="${token}">
      <input type="hidden" name="origUrl" value="">
      
      <div class="buttons">
        <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.LoginModule.listeners.login()">Log In</button>
        <button type="button" class="btn" onclick="WIKIDOT.modules.LoginModule.listeners.cancel()">Cancel</button>
      </div>
    </form>
  </div>
  
  <div class="login-options">
    <p><a href="/password-recovery">Forgot your password?</a></p>
    <p>Don't have an account? <a href="/join">Sign up</a> for free!</p>
  </div>
</div>
`;

export const loginStatusTemplate = (isLoggedIn: boolean, username?: string) => {
	if (isLoggedIn && username) {
		return `
<div class="login-status-module">
  <div class="logged-in">
    <p>You are currently logged in as <strong>${username}</strong>.</p>
    <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.LoginStatusModule.listeners.logout()">Log Out</button>
  </div>
</div>
`;
	}

	return `
<div class="login-status-module">
  <div class="not-logged-in">
    <p>You are not currently logged in.</p>
    <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.LoginStatusModule.listeners.login()">Log In</button>
    <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.LoginStatusModule.listeners.register()">Register</button>
  </div>
</div>
`;
};

export const passwordRecoveryTemplate = () => `
<div class="password-recovery-module">
  <h1>Password Recovery</h1>
  
  <div class="recovery-form">
    <form id="recovery-form">
      <div class="form-group">
        <label for="email">Email Address:</label>
        <input type="email" id="email" name="email" class="form-control" placeholder="Enter your registered email address">
        <small class="form-text text-muted">We'll send a password reset link to this email address.</small>
      </div>
      
      <div class="buttons">
        <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.PasswordRecoveryModule.listeners.recover()">Send Reset Link</button>
        <button type="button" class="btn" onclick="WIKIDOT.modules.PasswordRecoveryModule.listeners.cancel()">Cancel</button>
      </div>
    </form>
  </div>
</div>
`;
