using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;

namespace ClinicalPortal.Service
{
    public class UserInfoDB
    {
        private string _userDBFileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "user.txt");
        private List<UserInfo> _users;

        public UserInfoDB()
        {
            _users = new List<UserInfo>();
            GetUsers();
        }

        private void SaveToDB()
        {
            StringBuilder sb = new StringBuilder();
            foreach (UserInfo user in _users)
            {
                sb.AppendLine(user.Name + " : " + user.Password);
            }
            File.WriteAllText(_userDBFileName, sb.ToString());
        }

        public UserInfo AddUser(UserInfo user)
        {
            try
            {
                if (!IsExist(user.Name))
                {
                    _users.Add(user);
                    SaveToDB();
                    return user;
                }
            }catch(Exception e)
            {
                
            }
            return null;
        }

        public void RemoveUser(UserInfo user)
        {
            if (_users.Contains(user))
            {
                _users.Remove(user);
                SaveToDB();
            }
        }

        public bool IsExist(string userName)
        {
            return GetUser(userName) != null;
        }

        public UserInfo GetUser(string userName)
        {
            foreach (UserInfo user in _users)
            {
                if (user.Name == userName)
                {
                    return user;
                }
            }
            return null;
        }

        private void GetUsers()
        {
            try
            {
                string[] userRecords = File.ReadAllLines(_userDBFileName);
                foreach (string userRecord in userRecords)
                {
                    if (!string.IsNullOrEmpty(userRecord))
                    {
                        string trimedUserRecord = userRecord.Trim();
                        string[] userInfo = trimedUserRecord.Split(new char[] {':'},
                                                                   StringSplitOptions.RemoveEmptyEntries);
                        if (userInfo.Length == 2)
                        {
                            UserInfo user = new UserInfo() {Name = userInfo[0].Trim(), Password = userInfo[1].Trim()};
                            _users.Add(user);
                        }
                    }
                }
            }
            catch (Exception e)
            {

            }
        }
    }
}