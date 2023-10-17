import Nav from './nav/Nav';

const Header: React.FC = () => {
    return (
        <header className="p-3 mb-3 border bottom bg-dark bg-gradient">
            <p className="fs-2  mb-2 mb-lg-0 text-white">Ecommerce</p>
            <nav className="nav justify-content-center">
                <Nav></Nav>
            </nav>

            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        </header>
    );
};

export default Header;
