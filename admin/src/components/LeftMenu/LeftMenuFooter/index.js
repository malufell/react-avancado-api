 import React from 'react';
 import { PropTypes } from 'prop-types';
 
 import Wrapper from './Wrapper';
 
 function LeftMenuFooter({ version }) {
   // PROJECT_TYPE is an env variable defined in the webpack config
   // eslint-disable-next-line no-undef
   const projectType = PROJECT_TYPE;
 
   return (
     <Wrapper>
       <div className="poweredBy">
         <span>
            powered by
         </span>
         &nbsp;
         <a href="https://github.com/malufell" target="_blank" rel="noopener noreferrer">
            Malu
         </a>
       </div>
     </Wrapper>
   );
 }
 
 LeftMenuFooter.propTypes = {
   version: PropTypes.string.isRequired,
 };
 
 export default LeftMenuFooter;