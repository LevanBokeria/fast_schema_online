function trial_creator2(all_conditions){
    // debugger
    let all_trials = []

    // A function to create a cartesian product of two arrays
    const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));


    Object.keys(all_conditions).forEach(function(iCond,index){
        
        let iCondStages = all_conditions[iCond]

            let n_trials_per_pa  = jatos.studySessionData.inputData.n_trials_per_pa[iCond]

            let n_trials_per_ses = n_trials_per_pa * iCondStages.schema_learning.length
            let istage_n_ses = jatos.studySessionData.inputData.n_ses_per_condition[iCond]

            var schema_learning_coords = jatos.studySessionData.inputData.condition_coords[iCond].schema_learning

            for (iSes=0; iSes<istage_n_ses; iSes++){

                var session_trials = []

                for (iPA=0; iPA<iCondStages.schema_learning.length; iPA++){

                    for (iRep=0; iRep<n_trials_per_pa; iRep++){
                        debugger
                        iCond = 'random_locations'
                        schema_learning_coords = []

                        // Shuffle the coordinates of the schema PAs if its IC condition
                        if (iCond == 'schema_ic'){
                            schema_learning_coords = jsPsych.randomization.shuffle(schema_learning_coords)
                        } else if (iCond == 'random_locations'){
                            
                            
                            // Then, create a random location of 6 landmarks
                            
                            // Which rows and cols are allowed?
                            let allowed_rows = [2,3,4,5,6,7,8,9,10,11]
                            let allowed_cols = [2,3,4,5,6,7,8,9,10,11]
                            let allowed_rc = cartesian(allowed_rows,allowed_cols)

                            for (iLoc=0; iLoc <= 5; iLoc++){

                                // Randomly choose one of those
                                let rand_rc = jsPsych.randomization.sampleWithoutReplacement(allowed_rc,1)[0]

                                if (iLoc != 0){
                                    debugger
                                    // If its not the first one, then do a while loop till all conditions are satisfied
                                    let cond_sat = false

                                    while (cond_sat == false){

                                        // Temporarily set to true, change if any distance is less than X
                                        cond_sat = true

                                        // If all the distances are ok
                                        for (iCheck=0; iCheck < schema_learning_coords.length; iCheck++){

                                            let iDist = math.distance(schema_learning_coords[iCheck],rand_rc)

                                            if (iDist < Math.sqrt(2)){
                                                cond_sat = false
                                                break
                                            }
                                        }
                                        
                                        if (cond_sat == false){

                                            // generate another row
                                            rand_rc = jsPsych.randomization.sampleWithoutReplacement(allowed_rc,1)[0]

                                        }
                                    } // while
                                


                                } // iLoc != 0

                                // Remove from the choice options
                                const idx = allowed_rc.indexOf(rand_rc)
                                allowed_rc.splice(idx,1)
                                
                                // Add this to the schema_learning_coords vector
                                schema_learning_coords[iLoc] = [...rand_rc]

                            } // iLoc


                        } // which condition
                        debugger
                        
                        var trial = {
                            new_pa_img: iCondStages.new_pa_learning[iPA],
                            new_pa_img_idx: iPA,
                            new_pa_img_coords: jatos.studySessionData.inputData.condition_coords[iCond].new_pa_learning[iPA],
                            new_pa_all_imgs: iCondStages.new_pa_learning,
                            new_pa_all_img_coords: jatos.studySessionData.inputData.condition_coords[iCond].new_pa_learning,
                            schema_pa_imgs: iCondStages.schema_learning,
                            schema_pa_img_coords: schema_learning_coords,
                            condition: iCond,
                            color: jatos.studySessionData.inputData.condition_colors[iCond],
                            border_pattern: jatos.studySessionData.inputData.condition_border_patterns[iCond],
                            session: iSes,
                        }

                        session_trials.push(trial)

                    } // iRep
                
                } // iPA

                session_trials = jsPsych.randomization.shuffleNoRepeats(session_trials,function(a,b){return a.new_pa_img === b.new_pa_img})
        
                // Add a key about the trial counter and random offset 
                for (iT=0; iT < session_trials.length; iT++){

                    // Trial counter prompt
                    session_trials[iT]['trial_counter_prompt'] = '<p>Trial ' + (iT+1) + '/' + session_trials.length +'</p>'

                    // Trial counter itself
                    session_trials[iT]['trial_counter'] = iT

                    // top and left offsets
                    session_trials[iT]['top_offset-schema-display'] = Math.floor(Math.random() * 160)
                    session_trials[iT]['left_offset-schema-display'] = Math.floor(Math.random() * 160)

                    session_trials[iT]['top_offset-new-pa-learning'] = Math.floor(Math.random() * 160)
                    session_trials[iT]['left_offset-new-pa-learning'] = Math.floor(Math.random() * 160)                    

                }
                // debugger
                all_trials.push(session_trials)
            }
    });
    // debugger

    return all_trials
}