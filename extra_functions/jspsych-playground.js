/**
 * jspsych-serial-reaction-time
 * Josh de Leeuw
 *
 * plugin for running a serial reaction time task
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["playground"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'playground',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      stimulus_idx: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus index',
        default: null,
        description: 'Index of the paired-associate'
      },      
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      condition: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Experimental Condition',
        default: null,
        description: 'Name of the schema condition for this trial'
      },  
      stage: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Experimental Stage',
        default: null,
        description: 'Schema learning or New PA learning'
      },       
      coords: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Coordinates',
        array: true,
        default: null,
        description: 'This array contains row column coordinates for the image.'
      },        
      show_stimulus: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show prompt stimulus',
        default: false,
        description: 'This will decide whether the prompt item is shown or now.'
      }       
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

    // if its schema learning, then define a string like 'ses1' 'ses2' etc, to access img coords. Else if its new pa learning, then define a string 'new_pa'
    let curr_session = jatos.studySessionData.inputData.condition_ses_counters[trial.condition][trial.stage]
    let img_array    = jatos.studySessionData.inputData.stimuli[trial.condition][trial.stage]

    // Create the wrapper arena for box to move in
    wrapper_arena = document.createElement('div')
    wrapper_arena.id = 'wrapper_arena'
    wrapper_arena.style.height = '700px'
    wrapper_arena.style.width = '700px'
    wrapper_arena.style.border = '1px solid black'
    
    // Create the board
    grid_box = board_creator(600,
      jatos.studySessionData.inputData.n_rows,
      jatos.studySessionData.inputData.n_cols,
      jatos.studySessionData.inputData.condition_colors[trial.condition],
      false,
      img_array,
      jatos.studySessionData.inputData.condition_coords[trial.condition][trial.stage]['ses' + curr_session])

    //Add mouseclick listener MUST EDIT

    // Randomly modify grid position
    let top_offset = Math.floor(Math.random() * 100)
    let left_offset = Math.floor(Math.random() * 100)

    grid_box.style.position = 'relative'
    grid_box.style.top = top_offset + 'px'
    grid_box.style.left = left_offset + 'px'

    var all_cells = grid_box.querySelectorAll('.cells')

    for (iC=0; iC<all_cells.length; iC++){
      // console.log(iC)
      all_cells[iC].addEventListener('click',getResponse)
    }

    wrapper_arena.appendChild(grid_box)
    display_element.appendChild(wrapper_arena)

    // debugger
		
    //show prompt_question with the trial counter
    // let iTrial = jsPsych.data.get().values().length + 1
    // display_element.insertAdjacentHTML('beforeend', ' Trial ' + iTrial);

    if (trial.show_stimulus){
      //show stimulus
      let stimulus_element = document.createElement('img')
      stimulus_element.className = 'prompt_stimulus'
      stimulus_element.style.width = trial.stimulus_width
      stimulus_element.src = trial.stimulus
      stimulus_element.style.display = 'block'
      stimulus_element.style.margin = 'auto'

      display_element.appendChild(stimulus_element);    
    }
    // Add an empty feedback element
    let feedback_el = document.createElement('P')
    feedback_el.innerText = 'null'
    feedback_el.id = 'feedback_text'
    feedback_el.style.visibility = 'hidden'
    feedback_el.style['font-size'] = '125%'
    feedback_el.style['font-weight'] = 'bold' 

    display_element.appendChild(feedback_el)

    startTime = performance.now();

    // if(trial.trial_duration !== null){
      jsPsych.pluginAPI.setTimeout(function(){doFeedback(null,timeout)}, jatos.studySessionData.inputData.trial_duration);
    // }

    function getResponse(e){
      info = {}
      
      info.rt = performance.now() - startTime

      // Get the exact mouse coordinates relative to the page
      info.mouse_clientX = e.clientX
      info.mouse_clientY = e.clientY

      // Get the dimensions and location of the target item
      var pa_dim_loc = document.querySelector('#PA_'+trial.stimulus_idx).getBoundingClientRect()
      info.pa_center_x = pa_dim_loc.left + pa_dim_loc.width/2
      info.pa_center_y = pa_dim_loc.top + pa_dim_loc.height/2

      // Get row/col of the cell clicked
      let curr_row_col = e.currentTarget.id.split('_')
      info.row = parseInt(curr_row_col[2],10)
      info.col = parseInt(curr_row_col[4],10)

      if (info.row == trial.coords[0] & info.col == trial.coords[1]){
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
      // console.log('doFB called!')
      // debugger

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
      document.querySelector('#PA_'+trial.stimulus_idx).style.visibility = 'visible'

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      jsPsych.pluginAPI.setTimeout(function() {
        endTrial();
      }, jatos.studySessionData.inputData.feedback_duration);
    
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
      trial_data.stage = trial.stage
      trial_data.session = jatos.studySessionData.inputData.condition_ses_counters[trial.condition]
      trial_data.stimulus = trial.stimulus
      trial_data.corr_row = trial.coords[0]
      trial_data.corr_col = trial.coords[1]

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);

    };

  };

  return plugin;
})();
