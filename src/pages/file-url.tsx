import { MainLayout } from 'common/layout/main';
import { Loading } from 'components/skeleton-loader/loading';
import icaLogo from '../assets/ica_mobile_logo.svg';

export function FileURL() {

    const borderBox = 'border-box';
    const border = 'solid 1px';

    return (
        <MainLayout>
            <div style={{ display:'flex', height:'150px', justifyContent:'center', marginBottom:'50px', marginTop:'100px' }} >
                <img src={icaLogo} alt="ica"/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', height:'200px', width:'100%', justifyContent:'center', alignItems:'center', background:'#ffffff' }}>
                <div style={{ display:'flex', flexDirection:'column', height:'200px', width:'60%', justifyContent:'center', alignItems:'center', background:'#ffffff', boxSizing: borderBox, border, borderRadius: '10px' }}>
                    <div style={{ width:'100%', background:'#ffffff', display:'flex', flexDirection:'row', marginBottom:'20px', paddingLeft:'20px' }}> 
                        <div style={{ width:'50%', background:'#ffffff' }}> 
                            Mobile Number
                        </div>
                        <div style={{ width:'50%', background:'#ffffff' }}> 
                            <input type="text" name="Enter Mobile Number" style={{ boxSizing: 'border-box', border: 'solid 1px', borderRadius: '4px' }}/>
                        </div>
                    </div>
                    <div style={{ width:'100%', background:'#ffffff', display:'flex', flexDirection:'row', marginBottom:'20px', paddingLeft:'20px' }}> 
                        <div style={{ width:'50%', background:'#ffffff' }}> 
                            One-Time Password
                        </div>
                        <div style={{ width:'50%', background:'#ffffff' }}> 
                            <input type="text" name="Enter Mobile Number" style={{ boxSizing: borderBox, border: 'solid 1px', borderRadius: '4px' }}/>
                        </div>
                    </div>
                    <div style={{ width:'100%', background:'#ffffff', display:'flex', flexDirection:'row', marginBottom:'20px', paddingLeft:'20px' }}> 
                        <div style={{ width:'50%', background:'#ffffff' }} /> 
                        <div style={{ width:'50%', background:'#ffffff' }}> 
                            <button type="button" style={{ width:'wrap-content',paddingLeft:'20px', paddingRight:'20px', border: 'solid 1px', borderRadius: '5px' }}> Retrieve File </button>
                        </div>
                    </div>
                </div>
            </div>
           
            <div style={{ display:'flex', justifyContent:'center', marginTop:'30px', marginBottom:'200px' }} > </div>
        </MainLayout>
    )
}