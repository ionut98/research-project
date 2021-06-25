import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Context = createContext();

const Provider = ({ children }) => {

  const [isLogged, setIsLogged] = useState(false);
  const [selectedPole, setSelectedPole] = useState(null);
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [interventions, setInterventions] = useState([]);
  const [queries, setQueries] = useState([]);
  const [poles, setPoles] = useState([
    // eroilor
    {
      streetId: 'Eroilor 1',
      position: [45.43971842927667, 28.049074465226806],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 2',
      position: [45.43977112516494, 28.049460424988602],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 3',
      position: [45.43982382100397, 28.049889269168368],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 4',
      position: [45.43986898882683, 28.050382439975085],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 5',
      position: [45.439921684574465, 28.050897052990763],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 6',
      position: [45.43996685231898, 28.05130445496152],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 7',
      position: [45.44002707592208, 28.051786904663746],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 8',
      position: [45.44006471564139, 28.052515939769357],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 9',
      position: [45.44014752293547, 28.052955505053603],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 10',
      position: [45.44021527426751, 28.05343795475579],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 11',
      position: [45.44024538594451, 28.053984731085006],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 12',
      position: [45.4402905534299, 28.054606555145646],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 13',
      position: [45.440365832491835, 28.05508900484788],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 14',
      position: [45.440493806666666, 28.05565722338602],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Eroilor 15',
      position: [45.44056155758289, 28.056214720819714],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    // universitatii
    {
      streetId: 'Universitatii 16',
      position: [45.438378431581036, 28.055215538916418],
      lightIntensity: 25,
      minLightIntensity: 40,
      maxLightIntensity: 80,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 17',
      position: [45.44056155758289, 28.056214720819714],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 18',
      position: [45.43858921984464, 28.054593031532654],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 19',
      position: [45.43902585017138, 28.054582298646718],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 20',
      position: [45.43930438844223, 28.052714776495357],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 21',
      position: [45.439274276263006, 28.053541208711774],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 22',
      position: [45.439266748215715, 28.05436764092816],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 23',
      position: [45.439221579910736, 28.055237004688298],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 24',
      position: [45.439183939628975, 28.05608490267656],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 25',
      position: [45.43913877125772, 28.05693280066482],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Universitatii 26',
      position: [45.439176411569626, 28.057651904021924],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    // ariesului
    {
      streetId: 'Ariesului 27',
      position: [45.43860427611904, 28.05032136723278],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Ariesului 28',
      position: [45.43862686052312, 28.05080434709952],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Ariesului 29',
      position: [45.43868708555649, 28.051405388711434],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
    {
      streetId: 'Ariesului 30',
      position: [45.438762366757786, 28.052092293410],
      lightIntensity: 25,
      minLightIntensity: 10,
      maxLightIntensity: 100,
      sunLight: 20,
      humidity: 725,
      temperature: 23
    },
  ]);
  const [alerts, setAlerts] = useState([
    { target: 'Eroilor' },
    { target: 'Eroilor 13' },
    { target: 'Universitatii' },
    { target: 'Ariesului' },
  ]);

  const [queryResults, setQueryResults] = useState([
    {
      queryId: 1,
      queryType: 'traffic-jam',
      result: [
        {
          pcu: 'Universitatii',
          queryResult: 0.4 
        },
        {
          pcu: 'Ariesului',
          queryResult: 0.6
        },
        {
          pcu: 'Eroilor',
          queryResult: 0.5
        },
      ]
    },
    {
      queryId: 2,
      queryType: 'biggest-consumption',
      result: [
        {
          pcu: 'Universitatii',
          queryResult: 0.1 
        },
        {
          pcu: 'Ariesului',
          queryResult: 0.8
        },
        {
          pcu: 'Eroilor',
          queryResult: 0.3
        },
      ]
    },
  ]);

  const checkIfTokenValid = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    const result = await axios.post('http://localhost:30401/check-token', { token })
      .catch(error => {
        setIsLogged(false);
      });
    
    if (result) {
      setIsLogged(true);
    }
  };

  useEffect(() => {
    checkIfTokenValid();
  }, []);

  return (
    <Context.Provider
      value={{
        // VALUES
        isLogged,
        selectedPole,
        interventionModalOpen,
        poles,
        interventions,
        alerts,
        queryModalOpen,
        queries,
        queryResults,
        // METHODS,
        setIsLogged,
        setSelectedPole,
        setInterventionModalOpen,
        setPoles,
        setInterventions,
        setAlerts,
        setQueryModalOpen,
        setQueries,
        setQueryResults
      }}
    >
      {children}
    </Context.Provider>
  );

};

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  Context,
  Provider,
};
