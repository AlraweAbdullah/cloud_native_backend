
const Footer : React.FC = () => {
    return (
        <footer className="p-3 mb-3 border bottom bg-dark bg-gradient d-flex justify-content-center">
            <p className="fs-6 mb-2 mb-lg-0 text-white-50 text-decoration-none">
                Ecommerce {new Date().getFullYear()}
            </p>
        </footer>
    )

}


export default Footer