using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A standardized object that is returned from the server via ajax calls
    /// </summary>
    public class Payload {

        /// <summary>
        /// The class name of the model that is being sent/recieved
        /// </summary>
        public string className;

        /// <summary>
        /// Result code
        /// </summary>
        public int result;

        /// <summary>
        /// A simple message that can be used to identify a response.
        /// </summary>
        public string message;

        /// <summary>
        /// The object model
        /// </summary>
        public object model;

        /// <summary>
        /// An exception, if one exists.
        /// </summary>
        public string exception;

        //private IDictionary exceptionData;

        /// <summary>
        /// An inner exception if one exists
        /// </summary>
        public string innerException;

        /// <summary>
        /// Construct a Payload that contains an object model
        /// </summary>
        /// <param name="result"></param>
        /// <param name="className"></param>
        /// <param name="model"></param>
        /// <param name="message"></param>
        public Payload(int result, string className, object model, string message = "") {
            this.result = result;
            this.className = className;
            this.model = model;
            this.message = message;            
        }

        /// <summary>
        /// Construct a Payload that contains a result code and a message
        /// </summary>
        /// <param name="result"></param>
        /// <param name="message"></param>
        public Payload(int result, string message = "") {
            this.result = result;
            this.message = message;
        }

        /// <summary>
        /// Construct a Payload for cases where an exception message is returned
        /// </summary>
        /// <param name="result"></param>
        /// <param name="exception"></param>
        /// <param name="message"></param>
        public Payload(int result, Exception exception, string message = "") {
            this.className = "ERROR";
            this.result = result;
            this.exception = exception.GetType().ToString();
            this.message = exception.Message;

            // Exception specific actions
            switch (this.exception) {
                case "System.Data.Entity.Validation.DbEntityValidationException":
                    this.entityException((DbEntityValidationException)exception, this);
                    break;
                case "System.Collections.Generic.KeyNotFoundException":
                    this.keyException((KeyNotFoundException)exception, this);
                    break;
                default:
                    this.message = message += "\n\nException(" + exception.GetType() + ") Details:\n" + exception.Data.ToString() + "\n\n" + exception.Message;
                    break;
            }
        }
        /// <summary>
        /// Processes Inner Exceptions of an Entity Validation Exception
        /// </summary>
        /// <param name="ex">An Entity Validation Exception</param>
        /// <param name="payload">The Payload that is being processsed</param>
        private void keyException(KeyNotFoundException ex, Payload payload) {
            this.innerException = "";
            try {
                foreach (var e in (ex.Data)) {
                    payload.innerException += "{" + e.GetType() + "} => " + e.ToString() + "\n";
                }
            } catch (Exception e) {
                payload.innerException = "Failed to parse InnerException";
            }
        }
        /// <summary>
        /// Processes Inner Exceptions of an Entity Validation Exception
        /// </summary>
        /// <param name="ex">An Entity Validation Exception</param>
        /// <param name="payload">The Payload that is being processsed</param>
        private void entityException(DbEntityValidationException ex, Payload payload) {
            this.innerException = "";
            try {
                foreach (var err in (ex.EntityValidationErrors)) {
                    foreach (var e in err.ValidationErrors) {
                        payload.innerException += "{" + e.GetType() + "} => " + e.PropertyName + ": " + e.ErrorMessage + "\n";
                        if (e.PropertyName == "authorId") {
                            payload.exception = "AuthenticationException";
                            payload.message = "An Authentication Error Occurred.";
                            break;
                        }
                    }
                }
            } catch (Exception e) {
                payload.innerException = "Failed to parse InnerException";
            }
        }
        /*
        /// <summary>
        /// Construct a Payload for cases where an exception message is returned
        /// </summary>
        /// <param name="result"></param>
        /// <param name="exception"></param>
        /// <param name="message"></param>
        public Payload(int result, DbUpdateException exception, string message = "") {
           this.result = result;
           this.message = message; // += "\n\nException Details:\n" + exception.Data.ToString(); ;
           this.exception = exception.Message;
           this.innerException = exception.InnerException.ToString();
        }
        */
    }
}