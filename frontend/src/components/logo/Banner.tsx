import logo from '../../assets/logo.svg';
import './Banner.css'

export default function Banner() {
  return (
    <div className='flex flex-row fixed top-10'>
      <img className='mr-[20px]' src={logo} alt="electus logo" width="55" />
      <h1 className="title">Electus</h1>
    </div>
  );
}