// Type: NUnit.Framework.StringAssert
// Assembly: nunit.framework, Version=2.4.3.0, Culture=neutral, PublicKeyToken=96d09a1eb7f44a77
// Assembly location: E:\CPAjaxDemo\ClinicalPortalDemo\Src\ClinicalPortalTest\lib\nunit.framework.dll

using System.ComponentModel;

namespace NUnit.Framework
{
    public class StringAssert
    {
        [EditorBrowsable(EditorBrowsableState.Never)]
        public new static bool Equals(object a, object b);

        public new static void ReferenceEquals(object a, object b);
        public static void Contains(string expected, string actual, string message, params object[] args);
        public static void Contains(string expected, string actual, string message);
        public static void Contains(string expected, string actual);
        public static void StartsWith(string expected, string actual, string message, params object[] args);
        public static void StartsWith(string expected, string actual, string message);
        public static void StartsWith(string expected, string actual);
        public static void EndsWith(string expected, string actual, string message, params object[] args);
        public static void EndsWith(string expected, string actual, string message);
        public static void EndsWith(string expected, string actual);
        public static void AreEqualIgnoringCase(string expected, string actual, string message, params object[] args);
        public static void AreEqualIgnoringCase(string expected, string actual, string message);
        public static void AreEqualIgnoringCase(string expected, string actual);
        public static void IsMatch(string expected, string actual, string message, params object[] args);
        public static void IsMatch(string expected, string actual, string message);
        public static void IsMatch(string expected, string actual);
    }
}
