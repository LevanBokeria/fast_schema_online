/**
 * jspsych-serial-reaction-time
 * Josh de Leeuw
 *
 * plugin for running a serial reaction time task
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["playground2"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'playground2',
    description: '',
    parameters: {
      condition: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Experimental Condition',
        default: null,
        description: 'Name of the schema condition for this trial'
      },       
      coords: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Coordinates',
        array: true,
        default: null,
        description: 'This array contains row column coordinates for the image.'
      },   
      top_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Board top offset',
        default: null,
        description: 'Y offset of the board to randomize its position'
      },            
      left_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Board left offset',
        default: null,
        description: 'X offset of the board to randomize its position'
      },                  
      show_schema_pas: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show schema PAs',
        default: false,
        description: 'This will decide whether all the schema PAs are shown from the beginning.'
      },      
      show_new_pas: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show new PAs',
        default: false,
        description: 'This will decide whether all the new PAs are shown from the beginning.'
      },            
      allow_response: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow participant to respond',
        default: true,
        description: 'Record mouse click or not. If only showing the schema-PAs then dont record'
      },   
      show_feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show feedback or not',
        default: true,
        description: 'Show feedback or not'
      },  
      show_schema_pas_at_feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show schema PAs at feedback',
        default: false,
        description: 'This will decide whether all the schema PAs are shown at the feedback stage.'
      },                     
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response or untill moving on.'
      },
      trial_counter: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial counter',
        default: null,
        description: 'Which trial is this within this session?'
      },
      hide_cursor: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'hide cursor?',
        default: false,
        description: 'If its schema-PA display stage, hide the cursor.'
      },           
    }
  }

  plugin.trial = function(display_element, trial) {

    /////////////////////////////////////////////////////////////////////////////////////////////
    var timeout = true
    var startTime = -1;
    var response = {
      rt: null,
      row: null,
      col: null,
      correct: null, //null if missed, else true/false
    }
    // debugger

    // Hide the cursos?
    if (trial.hide_cursor){
      document.querySelector('.jspsych-content-wrapper').classList.add('noCursor')
    } else {
      document.querySelector('.jspsych-content-wrapper').classList.remove('noCursor')
    }
    
    // Get all the info from this trial here as a local variable
    var curr_trial = jatos.studySessionData.inputData.all_sessions[jatos.studySessionData.inputData.curr_session-1][trial.trial_counter]

    // Create the wrapper arena for box to move in
    wrapper_arena = document.createElement('div')
    wrapper_arena.id = 'wrapper_arena'
    wrapper_arena.style.height = '700px'
    wrapper_arena.style.width = '700px'
    wrapper_arena.style.border = '1px solid black'
    
    // Create the board
    grid_border = board_creator(500,
      jatos.studySessionData.inputData.n_rows,
      jatos.studySessionData.inputData.n_cols,
      trial.show_schema_pas,
      trial.show_new_pas,
      curr_trial)

    // Randomly modify grid position
    grid_border.style.position = 'relative'
    grid_border.style.top = trial.top_offset + 'px'
    grid_border.style.left = trial.left_offset + 'px'

    var all_cells = grid_border.querySelectorAll('.cells')

    
    if (trial.allow_response){
      for (iC=0; iC<all_cells.length; iC++){
        // console.log(iC)
        all_cells[iC].addEventListener('click',getResponse)
      }
    }

    wrapper_arena.appendChild(grid_border)
    display_element.appendChild(wrapper_arena)

    // Add an empty feedback element
    let feedback_el = document.createElement('P')
    feedback_el.innerText = 'null'
    feedback_el.id = 'feedback_text'
    feedback_el.style.visibility = 'hidden'
    feedback_el.style['font-size'] = '125%'
    feedback_el.style['font-weight'] = 'bold' 

    display_element.appendChild(feedback_el)

    startTime = performance.now();

    if (trial.allow_response) {

      jsPsych.pluginAPI.setTimeout(function(){doFeedback(null,timeout)}, trial.trial_duration);

    } else {
    
      jsPsych.pluginAPI.setTimeout(function(){endTrial()}, trial.trial_duration);

    }

    function getResponse(e){
      info = {}
      
      info.rt = performance.now() - startTime

      // Get the exact mouse coordinates relative to the page
      info.mouse_clientX = e.clientX
      info.mouse_clientY = e.clientY

      // Get the dimensions and location of the target item
      var pa_dim_loc = document.querySelector('#newPA_'+(curr_trial.new_pa_img_idx+1)).getBoundingClientRect()
      info.pa_center_x = pa_dim_loc.left + pa_dim_loc.width/2
      info.pa_center_y = pa_dim_loc.top + pa_dim_loc.height/2

      // Get row/col of the cell clicked
      let curr_row_col = e.currentTarget.id.split('_')
      info.row = parseInt(curr_row_col[2],10)
      info.col = parseInt(curr_row_col[4],10)

      if (info.row == curr_trial.new_pa_img_coords[0] & info.col == curr_trial.new_pa_img_coords[1]){
        info.correct = true
      } else {
        info.correct = false
      }

      // only record first response
      response = response.rt == null ? info : response;
      
      timeout = false

      doFeedback(info.correct,timeout);

    }

    function doFeedback(correct, timeout) {

      // Remove all the event listeners from all the cells.
      document.querySelectorAll('.cells').forEach(function(el){
        el.removeEventListener('click',getResponse,false)
      })

      if (timeout) {
        feedback_text = 'You missed...'
        document.querySelector('#feedback_text').innerText = feedback_text
        document.querySelector('#feedback_text').style.visibility = 'visible'
      } else {

        if (correct == true){
          feedback_text = 'Correct!'
          document.querySelector('#feedback_text').style.color = 'green'
        } else {
          feedback_text = 'Incorrect...!'
          document.querySelector('#feedback_text').style.color = 'red'
        }
        
        // show the feedback
        document.querySelector('#feedback_text').innerText = feedback_text
        document.querySelector('#feedback_text').style.visibility = 'visible'
      }

      // Show the true feedback!
      document.querySelector('#newPA_'+(curr_trial.new_pa_img_idx+1)).style.visibility = 'visible'
      document.querySelector('#newPA_'+(curr_trial.new_pa_img_idx+1)).parentElement.style.opacity = 1

      // If wanted, also show the schema PAs
      if (trial.show_schema_pas_at_feedback){
        
        document.querySelectorAll("[id^='schemaPA']").forEach(item => item.style.visibility = 'visible')
        document.querySelectorAll("[id^='schemaPA']").forEach(item => item.parentElement.style.opacity = 1)

      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // If we're showing feedback, then make a timeout function
      if (trial.show_feedback){
        jsPsych.pluginAPI.setTimeout(function() {
          endTrial();
        }, 
        jatos.studySessionData.inputData.feedback_duration);
      } else {
        endTrial();
      }

    }

    function endTrial() {
      // console.log('Another trial');
      
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // debugger
      // gather the data to store for the trial
      var trial_data = response;

      // Add trial variables to the trial data
      trial_data.condition = trial.condition
      trial_data.session = jatos.studySessionData.inputData.condition_ses_counters[trial.condition]
      trial_data.new_pa_img = curr_trial.new_pa_img
      trial_data.corr_row = curr_trial.new_pa_img_coords[0]
      trial_data.corr_col = curr_trial.new_pa_img_coords[1]
      trial_data.top_offset = trial.top_offset
      trial_data.left_offset = trial.left_offset
      trial_data.trial_stage = trial.data.trial_stage

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    };

  };

  return plugin;
})();
