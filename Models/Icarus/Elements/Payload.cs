using System;
using System.Collections;
using System.Collections.Generic;
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
            this.result = result;
            this.message = message += "\n\nException Details:\n" + exception.Data.ToString(); ;
            this.exception = exception.Message;
        }

        /// <summary>
        /// Construct a Payload for cases where an exception message is returned
        /// </summary>
        /// <param name="result"></param>
        /// <param name="exception"></param>
        /// <param name="message"></param>
        public Payload(int result, DbEntityValidationException exception, string message = "") {
            this.result = result;
            this.message = message; // += "\n\nException Details:\n" + exception.Data.ToString(); ;
            this.exception = exception.Message;
            this.innerException = "";
            try {
                foreach (var eve in exception.EntityValidationErrors) {
                    foreach (var ve in eve.ValidationErrors) {
                        //this.innerException += "\n ==> - Property: " + ve.PropertyName + ", Error: " + ve.ErrorMessage;
                        this.innerException += "\n ==> " + ve.PropertyName + ": " + ve.ErrorMessage;
                        this.message += "\n ==> " + ve.PropertyName + ": " + ve.ErrorMessage;
                    }
                }
            } catch (Exception e) {
                this.innerException = "Failed to parse InnerException";
            }
        }
    }
}