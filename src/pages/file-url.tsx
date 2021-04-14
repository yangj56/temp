import { MainLayout } from 'common/layout/main';
import { Loading } from 'components/skeleton-loader/loading';
import icaLogo from '../assets/ica_mobile_logo.svg';

export function FileURL() {

    return (
        <MainLayout>
            <div>File URL</div>
            <div style={{ display:'flex', height:'150px', justifyContent:'center', marginBottom:'50px' }} >
                <img src={icaLogo} alt="ica"/>
            </div>
            <div style={{ display:'flex', height:'40px', justifyContent:'center', alignItems:'center' }}>Mobile Number <input type="text" name="Enter Mobile Number" style={{ marginLeft:'40px', boxSizing: 'border-box', margin: 0, border: 'solid 1px' }}/></div>
            <div style={{ display:'flex', height:'40px', justifyContent:'center', alignItems:'center' }}>One-Time Pin <input type="text" name="Enter Mobile Number" style={{ marginLeft:'40px', boxSizing: 'border-box', margin: 0, border: 'solid 1px' }}/></div>
        </MainLayout>
    )
}