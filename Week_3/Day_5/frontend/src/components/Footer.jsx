import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Collections */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">COLLECTIONS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/collections/black-tea" className="text-gray-600 hover:text-gray-900">
                  Black teas
                </Link>
              </li>
              <li>
                <Link to="/collections/green-tea" className="text-gray-600 hover:text-gray-900">
                  Green teas
                </Link>
              </li>
              <li>
                <Link to="/collections/white-tea" className="text-gray-600 hover:text-gray-900">
                  White teas
                </Link>
              </li>
              <li>
                <Link to="/collections/herbal-tea" className="text-gray-600 hover:text-gray-900">
                  Herbal teas
                </Link>
              </li>
              <li>
                <Link to="/collections/matcha" className="text-gray-600 hover:text-gray-900">
                  Matcha
                </Link>
              </li>
              <li>
                <Link to="/collections/chai" className="text-gray-600 hover:text-gray-900">
                  Chai
                </Link>
              </li>
              <li>
                <Link to="/collections/oolong" className="text-gray-600 hover:text-gray-900">
                  Oolong
                </Link>
              </li>
              <li>
                <Link to="/collections/rooibos" className="text-gray-600 hover:text-gray-900">
                  Rooibos
                </Link>
              </li>
              <li>
                <Link to="/collections/teaware" className="text-gray-600 hover:text-gray-900">
                  Teaware
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">LEARN</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/about-teas" className="text-gray-600 hover:text-gray-900">
                  About our teas
                </Link>
              </li>
              <li>
                <Link to="/tea-academy" className="text-gray-600 hover:text-gray-900">
                  Tea academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ordering" className="text-gray-600 hover:text-gray-900">
                  Ordering and payment
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-gray-600 hover:text-gray-900">
                  Delivery
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy and policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">CONTACT US</h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-start"> 
                <img src="/images/Location.png" alt="location" className="mt-1 mr-2"/>
                3 Falahi, Falahi St, Pasdaran Ave,
                <br />
                Shiraz, Fars Providence
                <br />
                Iran
              </p>
              <p className="flex items-center"> 
                <img src="/images/Email.png" alt="email" className="mr-2"/>
                Email: amoopur@gmail.com
              </p>
              <p className="flex items-center">
                <img src="/images/Phone.png" alt="phone" className="mr-2"/>
                Tel: +98 9173038406
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
