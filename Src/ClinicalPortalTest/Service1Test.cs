using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace ClinicalPortalTest
{
    [TestFixture]
    public class Service1Test
    {
        private ClinicalPortalService.Service1 _service1;

        [TestFixtureSetUp]
        public void Init()
        {
            _service1 = new ClinicalPortalService.Service1();
        }

        [Test]
        public void TestGetMethodList()
        {
            string methodsJson = _service1.GetMethodList();
            StringAssert.StartsWith("[", methodsJson);
            StringAssert.EndsWith("]", methodsJson);
        }

    }
}
