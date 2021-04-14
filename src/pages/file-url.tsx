import { MainLayout } from 'common/layout/main';
import { Loading } from 'components/skeleton-loader/loading';
import icaLogo from '../assets/ica_mobile_logo.svg';

export function FileURL() {

    return (
        <MainLayout>
            <div style={{ display:'flex', height:'150px', justifyContent:'center', marginBottom:'50px', marginTop:'100px' }} >
                <img src={icaLogo} alt="ica"/>
            </div>
            <div style={{ display:'flex', height:'40px', justifyContent:'center', alignItems:'center' }}>Mobile Number <input type="text" name="Enter Mobile Number" style={{ marginLeft:'50px', boxSizing: 'border-box', border: 'solid 1px', borderRadius: '4px' }}/></div>
            <div style={{ display:'flex', height:'40px', justifyContent:'center', alignItems:'center' }}>One-Time Password <input type="text" name="Enter Mobile Number" style={{ marginLeft:'50px', boxSizing: 'border-box', border: 'solid 1px', borderRadius: '4px' }}/></div>
            <div style={{ display:'flex', justifyContent:'center', marginTop:'30px', marginBottom:'200px' }} ><button type="button" style={{ width:'wrap-content',paddingLeft:'20px', paddingRight:'20px', border: 'solid 1px', borderRadius: '5px' }}> Retrieve File </button></div>
        </MainLayout>
    )
}