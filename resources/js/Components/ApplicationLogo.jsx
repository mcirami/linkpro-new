
export default function ApplicationLogo(props) {
    console.log(Vapor.asset('images/logo.png'));
    return (
        <img src={Vapor.asset('images/logo.png')} alt="LinkPro"/>
    );
}
