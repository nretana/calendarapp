﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Calendar.Notification.API.Utilities.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class Common {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Common() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Calendar.Notification.API.Utilities.Resources.Common", typeof(Common).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Your event {0} has been added to your calendar on {1} at {2}..
        /// </summary>
        public static string Event_Notification_Added {
            get {
                return ResourceManager.GetString("Event_Notification_Added", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Your event has been proccessed..
        /// </summary>
        public static string Event_Notification_Default {
            get {
                return ResourceManager.GetString("Event_Notification_Default", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Your event {0} has been removed from your calendar..
        /// </summary>
        public static string Event_Notification_Removed {
            get {
                return ResourceManager.GetString("Event_Notification_Removed", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Your event {0} has been updated in your calendar on {1} at {2}..
        /// </summary>
        public static string Event_Notification_Updated {
            get {
                return ResourceManager.GetString("Event_Notification_Updated", resourceCulture);
            }
        }
    }
}
