using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ICARUS.Models;
using ICARUS.Models.Icarus.Elements;
using System.Collections.Generic;
using ICARUS.Models.Icarus;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using System.Net.Http;

namespace ICARUS.Controllers {
    //[Authorize] // Disable on initial build so that an admin can be created
    [AllowAnonymous]
    public class AccountController : Controller {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ApplicationDbContext context;
        public AccountController() {
            context = new ApplicationDbContext();
        }
        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager ) {
            UserManager = userManager;
            SignInManager = signInManager;
        }
        public ApplicationSignInManager SignInManager {
            get {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set { 
                _signInManager = value; 
            }
        }
        public ApplicationUserManager UserManager {
            get {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set {
                _userManager = value;
            }
        }

        /*
        /// <summary>
        /// GET for /Account/Login
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult Login(string returnUrl) {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
        */

        /// <summary>
        /// Recieves a LOGIN FormPost and 
        /// POST: /Account/Login
        /// Previous signature: Login(LoginViewModel model, string returnUrl)
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken] //ValidateAntiForgeryToken
        public async Task<ActionResult> Login(FormPost model) { //string returnUrl
            try {
                var formResults = model.resultsToDictionary();
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, 
                // change to shouldLockout: true
                var result = await SignInManager.PasswordSignInAsync(
                    formResults["Email"].ToString(), 
                    formResults["Password"].ToString(),
                    formResults.ContainsKey("RememberMe"), // checkbox
                    shouldLockout: false
                );
                switch (result) {
                    case SignInStatus.Success:
                        //return RedirectToLocal(returnUrl);
                        return Json(new Payload(1, "MODEL", result, "Successfully logged in"));
                    case SignInStatus.LockedOut:
                        //return View("Lockout");
                        return Json(new Payload(2, "Lockout", model), JsonRequestBehavior.AllowGet);

                    case SignInStatus.RequiresVerification:
                        /*return RedirectToAction("SendCode", new {
                            ReturnUrl = returnUrl,
                            RememberMe = true // formResults["RememberMe"].ToString() //model.RememberMe
                        });*/
                        //model.Add("RememberMe", true);
                        return Json(new Payload(3, "SendCode", model), JsonRequestBehavior.AllowGet);
                    case SignInStatus.Failure:
                    default:
                        ModelState.AddModelError("", "Invalid login attempt.");
                        return Json(new Payload(4, "InvalidLoginAttempt", model), JsonRequestBehavior.AllowGet);
                        //return View(model);
                }
            } catch (Exception e) {
                return Json(new Payload(2, e, "An exception occurred trying to log in"));
            }
        }
        /// <summary>
        /// GET: /Account/VerifyCode
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="returnUrl"></param>
        /// <param name="rememberMe"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe) {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync()) {
                return View("Error");
            }

            return View(new VerifyCodeViewModel {
                Provider = provider,
                ReturnUrl = returnUrl,
                RememberMe = rememberMe
            });
        }
        /// <summary>
        /// POST: /Account/VerifyCode
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model) {
            if (!ModelState.IsValid) {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(
                model.Provider, model.Code, isPersistent:  model.RememberMe, 
                rememberBrowser: model.RememberBrowser
            );

            switch (result) {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);

                case SignInStatus.LockedOut:
                    return View("Lockout");

                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }
        /*
        /// <summary>
        /// Attempts to register the given user 
        /// POST: /Account/Register
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model) {
            if (ModelState.IsValid) {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);

                if (result.Succeeded) {

                    //Assign Role to user Here 
                    await this.UserManager.AddToRoleAsync(user.Id, model.Name);
                    //Ends Here

                    await SignInManager.SignInAsync(user, isPersistent:false, rememberBrowser:false);

                    // For more information on how to enable account confirmation and 
                    // password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);

                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);

                    await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    return RedirectToAction("Index", "Home");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }
        */
        /// <summary>
        /// Attempts to register the given user 
        /// POST: /Account/Register
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(FormPost formPost) {
            try {
                var formResults = formPost.resultsToDictionary();
                var user = new ApplicationUser {
                    UserName = formResults["Email"].ToString(),
                    Email = formResults["Email"].ToString()
                };
                var result = await UserManager.CreateAsync(user, formResults["Password"].ToString());

                if (result.Succeeded) {

                    //Assign Role to user Here 
                    await this.UserManager.AddToRoleAsync(user.Id, "User");
                    //Ends Here

                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                    // For more information on how to enable account confirmation and 
                    // password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);

                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new {
                        userId = user.Id,
                        code = code
                    }, protocol: Request.Url.Scheme);

                    await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    //return RedirectToAction("Index", "Home");
                    return Json(new Payload(2, "Notification", result, "An email to confirm your account has been sent."));
                } else {
                    AddErrors(result);
                    return Json(new Payload(2, "Error", result, "Failed to create user.  See Results for details."));
                }
            } catch (Exception e) {
                return Json(new Payload(2, e, "An exception occurred trying to register a user."));
            }

            // If we got this far, something failed, redisplay form
            //return View(model);
            return Json(new Payload(2, "Error", new MODEL(), "Something went wrong."));
        }
        /// <summary>
        /// GET: /Account/ConfirmEmail
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code) {
            if (userId == null || code == null) {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }
        /*/// <summary>
        /// GET: /Account/ForgotPassword
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ForgotPassword() {
            return View();
        }*/
        /// <summary>
        /// Recieves a FormPost containing an email associated with Forgotten Password
        /// POST: /Account/ForgotPassword
        /// </summary>
        /// <param name="model"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(FormPost model, string returnUrl) {
            try {
                var formResults = model.resultsToDictionary();
                var email = formResults["Email"].ToString();
                var user = await UserManager.FindByNameAsync(email);

                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id))) {
                    // Don't reveal that the user does not exist or is not confirmed
                    //return View("ForgotPasswordConfirmation");
                    return Json(new Payload(5, "InvalidForgotPasswordAttempt", model), JsonRequestBehavior.AllowGet);
                }
                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code, email = user.Email, resetpassword = 1 }, protocol: Request.Url.Scheme);		
                await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");
                //return RedirectToAction("ForgotPasswordConfirmation", "Account");
                return Json(new Payload(1, "MODEL", "Forgot Password notification sent"));
            } catch (Exception e) {
                return Json(new Payload(2, e, "An exception occurred trying to validate a forgotten password"));
            }
        }
        /*/// <summary>
        /// POST: /Account/ForgotPassword
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model) {
            if (ModelState.IsValid) {
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id))) {
                    // Don't reveal that the user does not exist or is not confirmed
                    return View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                // string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                // var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);		
                // await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");
                // return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }*/
        /// <summary>
        /// GET: /Account/ForgotPasswordConfirmation
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation() {
            return View();
        }
        /// <summary>
        /// Resets the user's password
        /// GET: /Account/ResetPassword
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ResetPassword(string code) {
            return code == null ? View("Error") : View();
        }
        /// <summary>
        /// POST: /Account/ResetPassword
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(FormPost model) {
            try {
                var formResults = model.resultsToDictionary();
                var code = formResults["Code"].ToString();
                var password = formResults["Password"].ToString();
                var email = formResults["Email"].ToString();

                var user = await UserManager.FindByNameAsync(email);
                if (user == null) {
                    // Don't reveal that the user does not exist
                    //return RedirectToAction("ResetPasswordConfirmation", "Account");
                    return Json(new Payload(5, "InvalidResetPasswordAttempt", model), JsonRequestBehavior.AllowGet);
                }
                var result = await UserManager.ResetPasswordAsync(user.Id, code, password);
                if (result.Succeeded) {
                    //return RedirectToAction("ResetPasswordConfirmation", "Account");
                    return Json(new Payload(1, "MODEL", "Password reset success"));
                } else {
                    return Json(new Payload(2, "MODEL", "Password reset failed"));
                }
            } catch (Exception e) {
                return Json(new Payload(2, e, "An exception occurred trying to reset a password"));
            }
            //AddErrors(result);
            //return View();
        }
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation() {
            return View();
        }
        /// <summary>
        /// GET: /Account/ExternalLogin
        /// Returns the ExternalLogin.cshtml View
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ExternalLogin() {
            return View();
        }
        /// <summary>
        /// Retrieves the list of 3rd party OAuth Providers and returns them inside a Payload
        /// </summary>
        /// <returns>A Json Payload</returns>
        public async Task<ActionResult> GetLoginProviders() {
            var loginProviders = HttpContext.GetOwinContext().Authentication.GetExternalAuthenticationTypes();
            return Json(
                new Payload(1, "MODEL", loginProviders, "Retrieved OAuth Providers"), JsonRequestBehavior.AllowGet
            );
        }
        /// <summary>
        /// POST: /Account/ExternalLogin
        /// Third party OAuth2 Authorization
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl) {
            // Request a redirect to the external login provider
            var challengeResult = new ChallengeResult(provider,
                Url.Action("ExternalLoginCallback", "Account", new {
                    ReturnUrl = returnUrl
                })
            );
            return challengeResult;
        }

        /*
        /// <summary>
        /// POST: /Account/ExternalLogin
        /// Third party OAuth2 Authorization
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(FormPost formPost) {

            formPost.resultsToXml();
            string provider = formPost.parseString("provider");
            string returnUrl = formPost.parseString("returnUrl");

            // Request a redirect to the external login provider
            var redirectUri = Url.Action("ExternalLoginCallback", "Account", new {
                ReturnUrl = returnUrl
            });
            var challengeResult = new ChallengeResult(provider, redirectUri);

            string LoginProvider = challengeResult.LoginProvider;
            string RedirectUri = challengeResult.RedirectUri;
            string UserId = challengeResult.UserId;

            var properties = new AuthenticationProperties { RedirectUri = redirectUri };
            if (UserId != null) {
                properties.Dictionary[XsrfKey] = UserId;
            }

            this.ControllerContext.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);

            return Json(new Payload(1, "ChallengeResult", challengeResult, RedirectUri), JsonRequestBehavior.AllowGet);
        }
        */

        /// <summary>
        /// GET: /Account/ExternalLoginCallback
        /// Retrieves authentication from third party 
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl) {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null) {
                //return RedirectToAction("Login");
                //return Json(new Payload(1, "Redirect", new MODEL(), "Redirect to Account/Login because loginInfo was null for returnUrl: "+returnUrl), JsonRequestBehavior.AllowGet);

                return RedirectToLocal(returnUrl);
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: true);

            // Create model for Payload
            Dictionary<string, object> model = new Dictionary<string, object>();
            //model.Add("result", result);
            model.Add("ReturnUrl", returnUrl);
            model.Add("DefaultUserName", loginInfo.DefaultUserName);
            model.Add("Email", loginInfo.Email);
            model.Add("LoginProvider", loginInfo.Login.LoginProvider);

            var accessToken = loginInfo.ExternalIdentity.Claims
                .Where(c => c.Type.Equals("urn:google:accesstoken"))
                .Select(c => c.Value).FirstOrDefault();
            model.Add("AccessToken", accessToken);

            // https://stackoverflow.com/questions/22820349/how-to-get-google-plus-profile-picture-in-c-sharp-mvc-authentication
            Uri apiRequestUri = new Uri("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken.ToString());
            //request profile image
            using (var webClient = new System.Net.WebClient()) {
                var json = webClient.DownloadString(apiRequestUri);
                model.Add("GoogleIdentity", new JavaScriptSerializer().DeserializeObject(json));
            }

            switch (result) {
                case SignInStatus.Success:
                    //ViewBag.Payload = model;
                    TempData["payload"] = model;

                    //return RedirectToLocal(returnUrl);
                    //return Json(new Payload(1, "SignInStatus.Success: RedirectToLocal(returnUrl)", model), JsonRequestBehavior.AllowGet);return RedirectToAction("Index", "Home");

                case SignInStatus.LockedOut:
                    //return View("Lockout");
                    return Json(new Payload(2, "SignInStatus.LockedOut", model), JsonRequestBehavior.AllowGet);
                
                // See 
                case SignInStatus.RequiresVerification:
                    /*return RedirectToAction("SendCode", new {
                        ReturnUrl = returnUrl,
                        RememberMe = false
                    });*/
                    model.Add("RememberMe", false); // 20181229 previously true
                    return Json(new Payload(3, "SendCode", model), JsonRequestBehavior.AllowGet);

                case SignInStatus.Failure:
                default:

                    // If the user does not have an account, then prompt 
                    // the user to create an account
                    // See ExternaLoginConfirmation.cshtml
                    //ViewBag.ReturnUrl = returnUrl;
                    //ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    /*return View("ExternalLoginConfirmation", 
                        new ExternalLoginConfirmationViewModel {
                            Email = loginInfo.Email
                        }
                    );*/

                    // This works, but you still need to pass these values to MAIN and create a FORM
                    // to work with the results.  Exceptions can occur if the value already exists on the server.                    
                    
                    

                    ///////  Instead of returning the ExternalLoginConfirmation View, try processing the results right now!

                    if (User.Identity.IsAuthenticated) {
                        return Json(new Payload(1, "ExternaLoginConfirmation: RedirectToAction", model, "RedirectToAction('Index', 'Manage')"), JsonRequestBehavior.AllowGet);
                    }
                    
                    // Get the information about the user from the external login provider
                    var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                    if (info == null) {
                        return Json(new Payload(2, "ExternalLoginFailure", model), JsonRequestBehavior.AllowGet);
                    } else {
                        model.Add("ProviderKey", info.Login.ProviderKey);
                    }

                    // Attempt to create a User
                    var user = new ApplicationUser {
                        UserName = model["Email"].ToString(),
                        Email = model["Email"].ToString()
                    };
                    var rslt = await UserManager.CreateAsync(user);
                    if (rslt.Succeeded) {
                        rslt = await UserManager.AddLoginAsync(user.Id, info.Login);
                        if (rslt.Succeeded) {
                            rslt = await UserManager.AddToRoleAsync(user.Id, "User");
                            if(rslt.Succeeded) {
                                await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                                //return Json(new Payload(1, "AttemptToCreateUser: RedirectToLocal", model), JsonRequestBehavior.AllowGet);
                                return RedirectToLocal(returnUrl);
                            }
                        }
                    }

                    // If all else fails
                    model.Add("Errors", rslt.Errors);
                    return Json(
                        new Payload(
                            2, "AccountController.ExternalLoginCallback", 
                            model, "Failed to create user"
                        ), JsonRequestBehavior.AllowGet
                    );
                    //return Json(new Payload(5, "SignInStatus.Failure", model), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// POST: /Account/ExternalLoginConfirmation
        /// Creates the User account based on the results from the OAuth Provider
        /// </summary>
        /// <param name="model"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(
            ExternalLoginConfirmationViewModel model, string returnUrl
        ) {

            // Create model for Payload
            Dictionary<string, object> mdl = new Dictionary<string, object>();
            mdl.Add("Email", model.Email);
            mdl.Add("returnUrl", returnUrl);

            // If already logged in, redirect
            if (User.Identity.IsAuthenticated) {
                //return RedirectToAction("Index", "Manage");
                return Json(new Payload(1, "RedirectToAction", mdl, "RedirectToAction('Index', 'Manage')"), JsonRequestBehavior.AllowGet);
            }

            // Otherwise...
            if (ModelState.IsValid) {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null) {
                    //return View("ExternalLoginFailure");
                    return Json(new Payload(2, "ExternalLoginFailure", mdl, "info unavailable"), JsonRequestBehavior.AllowGet);
                } else {
                    mdl.Add("info", info);
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded) {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);

                    if (result.Succeeded) {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        //return RedirectToLocal(returnUrl);
                        return Json(new Payload(1, "RedirectToLocal", mdl), JsonRequestBehavior.AllowGet);
                    }
                }
                AddErrors(result);
            }

            //ViewBag.ReturnUrl = returnUrl;
            //return View(model);
            return Json(new Payload(1, "ExternalLoginConfirmationView", mdl), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// POST: /Account/LogOff
        /// Recieves the __RequestVerificationToken and logs out
        /// </summary>
        /// <returns>Json Payload</returns>
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<ActionResult> LogOff() {
            try {
                AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                return Json(new Payload(1, "Successfully logged out"), JsonRequestBehavior.AllowGet);
            } catch (Exception e) {
                return Json(new Payload(0, "Failed to log out"), JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// GET: /Account/ExternalLoginFailure
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure() {
            return View();
        }

        /// <summary>
        /// GET: /Account/SendCode
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <param name="rememberMe"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe) {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null) {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }
        /// <summary>
        /// POST: /Account/SendCode
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model) {
            if (!ModelState.IsValid) {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider)) {
                return View("Error");
            }

            return RedirectToAction("VerifyCode", new {
                Provider = model.SelectedProvider,
                ReturnUrl = model.ReturnUrl,
                RememberMe = model.RememberMe
            });
        }


        protected override void Dispose(bool disposing) {
            if (disposing) {
                if (_userManager != null) {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null) {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager {
            get {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result) {
            foreach (var error in result.Errors) {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl) {
            if (Url.IsLocalUrl(returnUrl)) {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null) {
            }

            public ChallengeResult(string provider, string redirectUri, string userId) {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            /// <summary>
            /// Custom implementation of ChallengeResult for SPA
            /// </summary>
            /// <param name="formPost"></param>
            public ChallengeResult(FormPost formPost) {
                Dictionary<string, object> results = formPost.resultsToDictionary();
                LoginProvider = results["provider"].ToString();
                RedirectUri = results["redirectUri"].ToString();
                UserId = results["userId"].ToString();
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context) {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null) {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}