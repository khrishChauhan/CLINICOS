import { getDoctorsAction } from './src/actions/doctors/doctorActions';
getDoctorsAction().then(res => console.log(JSON.stringify(res, null, 2))).catch(console.error);
