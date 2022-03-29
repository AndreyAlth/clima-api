require('dotenv').config()
const { leerInput, 
        inquirerMenu, 
        pausa, 
        listarLugares, 
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;

    do{
        opt = await inquirerMenu();

        switch( opt ){
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //Buscar lugares
                const lugares = await busquedas.ciudad( termino );

                //Sellecionar el lugar
                const id = await listarLugares(lugares);
                if( id === '0') continue;

                //Sellecionar el lugar tomado
                const lugarSel = lugares.find(lugar => lugar.id === id)
                // console.log(lugarSel)

                //Guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre );

                //Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                console.clear()
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green)
                console.log('Lat:', lugarSel.lat)
                console.log('Lng:', lugarSel.lng)
                console.log('Temperatura:', clima.temp,)
                console.log('Minima:', clima.min)
                console.log('Maxima:', clima.max)
                console.log('Cómo está el clima: ', clima.desc.green)
            break;

            case 2:
                busquedas.leerDB()
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }`);
                })

            break;

        }

        console.log('\n');
        if (opt !== 0 ) await pausa();
    } while( opt !== 0);
}


main();