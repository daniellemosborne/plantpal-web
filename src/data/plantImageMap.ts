import aloevera from '../assets/plant_imgs/aloevera.png';
import banana from '../assets/plant_imgs/banana.png';
import bilimbi from '../assets/plant_imgs/bilimbi.png';
import cantaloupe from '../assets/plant_imgs/cantaloupe.png';
import cassava from '../assets/plant_imgs/cassava.png';
import chilipepper from '../assets/plant_imgs/chilipepper.png';
import coconut from '../assets/plant_imgs/coconut.png';
import corn from '../assets/plant_imgs/corn.png';
import cucumber from '../assets/plant_imgs/cucumber.png';
import curcuma from '../assets/plant_imgs/curcuma.png';
import eggplant from '../assets/plant_imgs/eggplant.png';
import galangal from '../assets/plant_imgs/galangal.png';
import ginger from '../assets/plant_imgs/ginger.png';
import guava from '../assets/plant_imgs/guava.png';
import kale from '../assets/plant_imgs/kale.png';
import longbeans from '../assets/plant_imgs/longbeans.png';
import mango from '../assets/plant_imgs/mango.png';
import melon from '../assets/plant_imgs/melon.png';
import orange from '../assets/plant_imgs/orange.png';
import paddy from '../assets/plant_imgs/paddy.png';
import papaya from '../assets/plant_imgs/papaya.png';
import pineapple from '../assets/plant_imgs/pineapple.png';
import pomelo from '../assets/plant_imgs/pomelo.png';
import shallot from '../assets/plant_imgs/shallots.png';
import soybeans from '../assets/plant_imgs/soybeans.png';
import spinach from '../assets/plant_imgs/spinach.png';
import sweetpotatoes from '../assets/plant_imgs/sweetpotatoes.png';
import tobacco from '../assets/plant_imgs/tobacco.png';
import waterapple from '../assets/plant_imgs/waterapple.png';
import watermelon from '../assets/plant_imgs/watermelon.png';
import unknownPlant from '../assets/unknown.png' 

const plantImageMap: Record<string, string> = {
    "Aloe Vera": aloevera,
    "Banana": banana,
    "Bilimbi": bilimbi,
    "Cantaloupe": cantaloupe,
    "Cassava": cassava,
    "Chili Pepper": chilipepper,
    "Coconut": coconut,
    "Corn": corn,
    "Cucumber": cucumber,
    "Curcuma": curcuma,
    "Eggplant": eggplant,
    "Galangal": galangal,
    "Ginger": ginger,
    "Guava": guava,
    "Kale": kale,
    "Longbeans": longbeans,
    "Mango": mango,
    "Melon": melon,
    "Orange": orange,
    "Paddy": paddy,
    "Papaya": papaya,
    "Pineapple": pineapple,
    "Pomelo": pomelo,
    "Shallot": shallot,
    "Soybeans": soybeans,
    "Spinach": spinach,
    "Sweet Potatoes": sweetpotatoes,
    "Tobacco": tobacco,
    "Water Apple": waterapple,
    "Watermelon": watermelon,
    "Unknown": unknownPlant
  };
  
  export const getPlantImage = (label: string): string => {
    return plantImageMap[label] ?? unknownPlant;
  };