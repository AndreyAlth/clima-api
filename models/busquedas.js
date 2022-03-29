const fs = require('fs');
const axios = require('axios');

class Busquedas{
    historial = [];
    dbPath= './db/database.json'

    constructor(){
        //TODO: leer DB si existe
        this.leerDB();
    }

    // get paramsMapbox(){
    //     return {
    //         'access_token': process.env.MAPBOX_KEY,
    //         'limit': 5,
    //         'language': 'es'
    //     }
    // }

    get historialCapitalizado(){
        //Capitaliza cada palabra
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');

        });
    }

    get paramsWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }

    }

    async ciudad( lugar = ''){

        

        try{
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: {
                    'limit':5,
                    'language':'es',
                    'access_token': 'pk.eyJ1IjoiYW5kcmV5YWx0aCIsImEiOiJja3pnampqanEwN2l5Mm9xaG1udmdzN3ZjIn0.hutRSfyWPnl9a-hELWPqjQ'
                }
            });

            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        } catch(error){
            throw error;

        }

        return []; //retornar los lugares
    }

    async climaLugar( lat, lon){
        try {

            //axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params:{
                    ...this.paramsWeather,
                    lat,
                    lon
                }

            })

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return{
                desc : weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error)
        }

    }

    agregarHistorial( lugar = ''){
        //TODO: prevenir duplicado
        if(this.historial.includes( lugar.toLocaleLowerCase())){
            return;
        }

        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en DB
        this.guardarDB();

    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));

    }

    leerDB() {

        //leer db
        //checar si existe el documento
        if( !fs.existsSync(this.dbPath)){
            return null;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse( info );
        this.historial = data.historial;

    }

}

module.exports = Busquedas;