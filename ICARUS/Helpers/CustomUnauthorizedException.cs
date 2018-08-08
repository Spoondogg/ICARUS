using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Helpers {
    [Serializable]
    public class CustomUnauthorizedException : Exception {

        public CustomUnauthorizedException() : base() {

        }

    }
}