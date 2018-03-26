using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace ICARUS.Helpers {

    /// <summary>
    /// Extensions for the System.Configuration.Configuration class.
    /// </summary>
    public static class MyConfigurationExtensions {

        /// <summary>
        /// Extension method to allow encryption/decryption of connection string section of configuration file(s).
        /// Note: Need to provide modify access to the app directory for {machine}\IIS_IUSRS so the app can re-write the file(s) after encrypting the contents.
        /// </summary>
        /// <param name="config">Configuration file object to be encrypted.</param>
        /// <param name="encrypt">Boolean sets whether method will be enrypting or decrypting using the executing machine's encryption library/key.</param>
        public static void EncryptConnectionString(this Configuration config, bool encrypt) {
            try {
                // Open the configuration file and retrieve the connectionStrings section.
                ConnectionStringsSection configSection = config.GetSection("connectionStrings") as ConnectionStringsSection;
                if ((!(configSection.ElementInformation.IsLocked)) && (!(configSection.SectionInformation.IsLocked))) {
                    if (encrypt && !configSection.SectionInformation.IsProtected) {

                        // This line will encrypt the file.
                        configSection.SectionInformation.ProtectSection("DataProtectionConfigurationProvider");

                        // Jump to save after making changes
                        goto save;

                    }

                    // encrypt is false so decrypt.
                    if (!encrypt && configSection.SectionInformation.IsProtected) {
                        // This line will decrypt the file. 
                        configSection.SectionInformation.UnprotectSection();

                        // Jump to save after making changes.
                        goto save;
                    }

                    // Exit method without saving to prevent superfluous app reloads caused by changes to web.config.
                    return;

                    // Only execute save code if sent here after making changes to file.
                    // Prevents repetitive app restarts caused by looping changes to web.config.
                    save:
                    // Re-save the configuration file section.
                    configSection.SectionInformation.ForceSave = true;

                    // Save the current configuration.
                    config.Save();
                }
            } catch (Exception ex) {
                Console.WriteLine(ex.ToString());
            }
        }

        /// <summary>
        /// Extension method to allow encryption/decryption of mailSettings section of configuration file(s).
        /// Note: Need to provide modify access to the app directory for IIS_IUSRS so the app can re-write the file(s) after encrypting the contents.
        /// </summary>
        /// <param name="configMail">Configuration file object to be encrypted.</param>
        /// <param name="encrypt">Boolean sets whether method will be enrypting or decrypting using the executing machine's encryption library/key.</param>
        public static void EncryptMailSettings(this Configuration configMail, bool encrypt) {
            try {
                // Open the configuration file and retrieve the mailSettings section.
                ConfigurationSection mailSettingsSection = configMail.GetSection("system.net/mailSettings/smtp");
                if ((!(mailSettingsSection.ElementInformation.IsLocked)) && (!(mailSettingsSection.SectionInformation.IsLocked))) {
                    if (encrypt && !mailSettingsSection.SectionInformation.IsProtected) {

                        // This line will encrypt the file.
                        mailSettingsSection.SectionInformation.ProtectSection("DataProtectionConfigurationProvider");

                        // Jump to save after making changes
                        goto save;

                    }

                    // encrypt is false so decrypt.
                    if (!encrypt && mailSettingsSection.SectionInformation.IsProtected) {
                        // This line will decrypt the file. 
                        mailSettingsSection.SectionInformation.UnprotectSection();

                        // Jump to save after making changes.
                        goto save;
                    }

                    // Exit method without saving to prevent superfluous app reloads caused by changes to web.config.
                    return;

                    // Only execute save code if sent here after making changes to file.
                    // Prevents repetitive app restarts caused by looping changes to web.config.
                    save:
                    // Re-save the configuration file section.
                    mailSettingsSection.SectionInformation.ForceSave = true;

                    // Save the current configuration.
                    configMail.Save();
                }
            } catch (Exception ex) {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}