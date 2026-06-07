import React, { useState, useEffect } from 'react'; 
import { Droplets, RefreshCw, CheckCircle, Award } from 'lucide-react'; 
 
const WATER_DATA = [ 
  { id: 1, term: "Hydrological cycle", def: "How water moves around between the atmosphere, oceans, rivers and the land." }, 
  { id: 2, term: "Precipitation", def: "Occurs as water droplets get bigger and heavier they begin to fall as rain, snow and sleet, etc." }, 
  { id: 3, term: "Condensation", def: "Occurs when water vapour cools and turns into water droplets." }, 
  { id: 4, term: "Evaporation", def: "When the sun heats up water from the oceans, rivers, lakes etc. and it goes into the air as water vapour." }, 
  { id: 5, term: "Transpiration", def: "When the sun heats up water from the leaves of trees and it goes into the air as water vapour." }, 
  { id: 6, term: "Surface run-off", def: "When the water runs over the surface of the ground. This water moves quickly to the river." }, 
  { id: 7, term: "Infiltration", def: "When water soaks into the soil." }, 
  { id: 8, term: "Through flow", def: "Horizontal movement of water through the soil back to the river." }, 
  { id: 9, term: "Drainage basin", def: "An area of land drained by a river and its tributaries." } 
]; 
 
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5); 
 
export default function App() { 
  const [terms, setTerms] = useState([]); 
  const [defs, setDefs] = useState([]); 
   
  const [selectedTerm, setSelectedTerm] = useState(null); 
  const [selectedDef, setSelectedDef] = useState(null); 
   
  const [matchedIds, setMatchedIds] = useState([]); 
  const [isEvaluating, setIsEvaluating] = useState(false); 
  const [errorPair, setErrorPair] = useState(null); 
  const [moves, setMoves] = useState(0); 
   
  const initializeGame = () => { 
    setTerms(shuffleArray(WATER_DATA.map(d => ({ id: d.id, text: d.term })))); 
    setDefs(shuffleArray(WATER_DATA.map(d => ({ id: d.id, text: d.def })))); 
    setSelectedTerm(null); 
    setSelectedDef(null); 
    setMatchedIds([]); 
    setErrorPair(null); 
    setMoves(0); 
    setIsEvaluating(false); 
  }; 
   
  useEffect(() => { 
    initializeGame(); 
  }, []); 
   
  useEffect(() => { 
    if (selectedTerm !== null && selectedDef !== null) { 
      setIsEvaluating(true); 
      setMoves(m => m + 1); 
   
      if (selectedTerm === selectedDef) { 
        setTimeout(() => { 
          setMatchedIds(prev => [...prev, selectedTerm]); 
          setSelectedTerm(null); 
          setSelectedDef(null); 
          setIsEvaluating(false); 
        }, 500); 
      } else { 
        setErrorPair({ term: selectedTerm, def: selectedDef }); 
        setTimeout(() => { 
          setErrorPair(null); 
          setSelectedTerm(null); 
          setSelectedDef(null); 
          setIsEvaluating(false); 
        }, 1200); 
      } 
    } 
  }, [selectedTerm, selectedDef]); 
   
  const handleTermClick = (id) => { 
    if (isEvaluating || matchedIds.includes(id)) return; 
    setSelectedTerm(id === selectedTerm ? null : id); 
  }; 
   
  const handleDefClick = (id) => { 
    if (isEvaluating || matchedIds.includes(id)) return; 
    setSelectedDef(id === selectedDef ? null : id); 
  }; 
   
  const isGameComplete = matchedIds.length === WATER_DATA.length && WATER_DATA.length > 0; 
   
  return ( 
    <div className="min-h-screen bg-sky-50 p-4 md:p-8 font-sans text-slate-800"> 
      <div className="max-w-5xl mx-auto"> 
         
        {/* Header */} 
        <header className="mb-8 text-center"> 
          <div className="flex items-center justify-center gap-3 mb-2"> 
            <Droplets className="w-8 h-8 text-blue-500" /> 
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Water Cycle Match</h1> 
          </div> 
          <p className="text-slate-600 max-w-xl mx-auto"> 
            Select a key term on the left, then find its correct definition on the right. Match all pairs to complete the cycle! 
          </p> 
          <div className="mt-4 flex items-center justify-center gap-4 text-sm font-medium"> 
            <span className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"> 
              Matches: {matchedIds.length} / {WATER_DATA.length} 
            </span> 
            <span className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"> 
              Moves: {moves} 
            </span> 
            <button 
              onClick={initializeGame} 
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full transition-colors cursor-pointer" 
            > 
              <RefreshCw className="w-4 h-4" /> Restart 
            </button> 
          </div> 
        </header> 
   
        {/* Victory State */} 
        {isGameComplete && ( 
          <div className="mb-8 p-6 bg-green-100 border-2 border-green-400 rounded-2xl text-center shadow-lg"> 
            <Award className="w-16 h-16 text-green-600 mx-auto mb-4" /> 
            <h2 className="text-2xl font-bold text-green-800 mb-2">Excellent Work!</h2> 
            <p className="text-green-700 mb-4">You successfully matched all the water cycle terms in {moves} moves.</p> 
            <button 
              onClick={initializeGame} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 active:scale-95" 
            > 
              Play Again 
            </button> 
          </div> 
        )} 
   
        {/* Game Board */} 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative"> 
           
          {/* Terms Column */} 
          <div className="flex flex-col gap-3"> 
            <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-sm mb-2 px-2">Key Terms</h3> 
            {terms.map((item) => { 
              const isMatched = matchedIds.includes(item.id); 
              const isSelected = selectedTerm === item.id; 
              const isError = errorPair?.term === item.id; 
   
              return ( 
                <button 
                  key={`term-${item.id}`} 
                  onClick={() => handleTermClick(item.id)} 
                  disabled={isMatched || isEvaluating} 
                  className={` 
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between 
                    ${isMatched ? 'bg-slate-100 border-slate-200 opacity-50 text-slate-400' : ''} 
                    ${isSelected && !isError ? 'bg-blue-500 border-blue-600 text-white shadow-md transform scale-[1.02]' : ''} 
                    ${isError ? 'bg-red-100 border-red-500 text-red-700 animate-shake' : ''} 
                    ${!isMatched && !isSelected && !isError ? 'bg-white border-blue-200 hover:border-blue-400 text-blue-900 shadow-sm hover:shadow' : ''} 
                  `} 
                > 
                  <span className="font-semibold text-lg">{item.text}</span> 
                  {isMatched && <CheckCircle className="w-5 h-5 text-slate-400" />} 
                </button> 
              ); 
            })} 
          </div> 
   
          {/* Definitions Column */} 
          <div className="flex flex-col gap-3"> 
            <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-sm mb-2 px-2">Definitions</h3> 
            {defs.map((item) => { 
              const isMatched = matchedIds.includes(item.id); 
              const isSelected = selectedDef === item.id; 
              const isError = errorPair?.def === item.id; 
   
              return ( 
                <button 
                  key={`def-${item.id}`} 
                  onClick={() => handleDefClick(item.id)} 
                  disabled={isMatched || isEvaluating} 
                  className={` 
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between 
                    ${isMatched ? 'bg-slate-100 border-slate-200 opacity-50 text-slate-400' : ''} 
                    ${isSelected && !isError ? 'bg-teal-500 border-teal-600 text-white shadow-md transform scale-[1.02]' : ''} 
                    ${isError ? 'bg-red-100 border-red-500 text-red-700 animate-shake' : ''} 
                    ${!isMatched && !isSelected && !isError ? 'bg-white border-teal-200 hover:border-teal-400 text-teal-900 shadow-sm hover:shadow' : ''} 
                  `} 
                > 
                  <span className="text-sm md:text-base leading-relaxed">{item.text}</span> 
                  {isMatched && <CheckCircle className="w-5 h-5 text-slate-400 flex-shrink-0 ml-3" />} 
                </button> 
              ); 
            })} 
          </div> 
   
        </div> 
      </div> 
   
      <style dangerouslySetInnerHTML={{__html: ` 
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-5px); } 
          75% { transform: translateX(5px); } 
        } 
        .animate-shake { 
          animation: shake 0.4s ease-in-out; 
        } 
      `}} /> 
    </div> 
  ); 
}
