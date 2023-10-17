import './Loader.css'

export function Loader() {
    return <div>
        <div className='loader'></div>
        <div className='loader' style={{ animationDelay: "1.0s" }}></div>
        <div className='loader' style={{ animationDelay: "2.0s" }}></div>
    </div>
}