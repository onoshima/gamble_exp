/*
The MIT License (MIT)
Copyright (c) 2014-2022 Joshua R. de Leeuw

This software includes modifications made by Takahiro Onoshima to the original
software licensed under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var jsPsychIatHtml = (function (jspsych) {
  'use strict';

  const info = {
      name: "iat-html",
      parameters: {
          /** The HTML string to be displayed. */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: undefined,
          },
          /** Key press that is associated with the left category label.*/
          left_category_key: {
              type: jspsych.ParameterType.KEY,
              pretty_name: "Left category key",
              default: "e",
          },
          /** Key press that is associated with the right category label. */
          right_category_key: {
              type: jspsych.ParameterType.KEY,
              pretty_name: "Right category key",
              default: "i",
          },
          /** The label that is associated with the stimulus. Aligned to the left side of page */
          left_category_label: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Left category label",
              array: true,
              default: ["left"],
          },
          /** The label that is associated with the stimulus. Aligned to the right side of the page. */
          right_category_label: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Right category label",
              array: true,
              default: ["right"],
          },
          /** Array containing the key(s) that allow the user to advance to the next trial if their key press was incorrect. */
          key_to_move_forward: {
              type: jspsych.ParameterType.KEYS,
              pretty_name: "Key to move forward",
              default: "ALL_KEYS",
          },
          /** If true, then html when wrong will be displayed when user makes an incorrect key press. */
          display_feedback: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Display feedback",
              default: false,
          },
          /** The HTML to display when a user presses the wrong key. */
          html_when_wrong: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "HTML when wrong",
              default: '<span style="color: red; font-size: 80px">X</span>',
          },
          /** Instructions shown at the bottom of the page. */
          bottom_instructions: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Bottom instructions",
              default: "<p>If you press the wrong key, a red X will appear. Press any key to continue.</p>",
          },
          /** If true, in order to advance to the next trial after a wrong key press the user will be forced to press the correct key. */
          force_correct_key_press: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Force correct key press",
              default: false,
          },
          /** Stimulus will be associated with either "left" or "right". */
          stim_key_association: {
              type: jspsych.ParameterType.SELECT,
              pretty_name: "Stimulus key association",
              options: ["left", "right"],
              default: undefined,
          },
          /** If true, trial will end when user makes a response. */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
          },
          /** How long to show the trial. */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
      },
  };
  /**
   * **iat-html**
   *
   * jsPsych plugin for running an IAT (Implicit Association Test) with an HTML-formatted stimulus
   *
   * @author Kristin Diep
   * @see {@link https://www.jspsych.org/plugins/jspsych-iat-html/ iat-html plugin documentation on jspsych.org}
   */
  class IatHtmlPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          var html_str = "";
          html_str +=
              "<div style='position: absolute; height: 20%; width: 100%; margin-left: auto; margin-right: auto; top: 42%; left: 0; right: 0'><p id='jspsych-iat-stim'>" +
                  trial.stimulus +
                  "</p></div>";
          html_str += "<div id='trial_left_align' style='position: absolute; top: 18%; left: 20%'>";
          if (trial.left_category_label.length == 1) {
              html_str +=
                      trial.left_category_key +
                      " キーを押す <br> " +
                      "<span id='category_label'>" +
                      trial.left_category_label[0] +
                      "</span></div>";
          }
          else {
              html_str +=
                      trial.left_category_key +
                      " キーを押す <br> " +
                      "<span id='category_label'>" +
                      trial.left_category_label[0] +
                      "</span><br>" +
                      "または<br>" +
                      "<span id='category_label'>" +
                      trial.left_category_label[1] +
                      "</span></div>";
          }
          html_str += "<div id='trial_right_align' style='position: absolute; top: 18%; right: 20%'>";
          if (trial.right_category_label.length == 1) {
              html_str +=
                      trial.right_category_key +
                      " キーを押す <br> " +
                      "<span id='category_label'>" +
                      trial.right_category_label[0] +
                      "</span></div>";
          }
          else {
              html_str +=
                      trial.right_category_key +
                      " キーを押す <br> " +
                      "<span id='category_label'>" +
                      trial.right_category_label[0] +
                      "</span><br>" +
                      "または<br>" +
                      "<span id='category_label'>" +
                      trial.right_category_label[1] +
                      "</span></div>";
          }
          html_str +=
              "<div id='wrongImgID' style='position:relative; top: 300px; margin-left: auto; margin-right: auto; left: 0; right: 0'>";
          if (trial.display_feedback === true) {
              html_str +=
                  "<div id='wrongImgContainer' style='visibility: hidden; position: absolute; top: -75px; margin-left: auto; margin-right: auto; left: 0; right: 0'><p>" +
                      trial.html_when_wrong +
                      "</p></div>";
              html_str += "<div>" + trial.bottom_instructions + "</div>";
          }
          else {
              html_str += "<div>" + trial.bottom_instructions + "</div>";
          }
          html_str += "</div>";
          display_element.innerHTML = html_str;
          // store response
          var response = {
              rt: null,
              key: null,
              correct: false,
              rt_last_response: null
          };
          // flag to start keyboardListner
          var is_first_response = true;
          // function to end trial when it is time
          const end_trial = () => {
              // kill any remaining setTimeout handlers
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // kill keyboard listeners
              if (typeof keyboardListener !== "undefined") {
                  this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
              }
              if (typeof Listener2 !== "undefined") {
                this.jsPsych.pluginAPI.cancelKeyboardResponse(Listener2);
              }
              // gather the data to store for the trial
              var trial_data = {
                  rt: response.rt,
                  stimulus: trial.stimulus,
                  response: response.key,
                  correct: response.correct,
                  rt_last_response: response.rt_last_response
              };
              // clears the display
              let iat_stim = display_element.querySelector("#jspsych-iat-stim");
              iat_stim.style.visibility = "hidden";
              let wImg = document.getElementById("wrongImgContainer");
              wImg.style.visibility = "hidden";

              // move on to the next trial
              this.jsPsych.pluginAPI.setTimeout(() => {
                this.jsPsych.finishTrial(trial_data);;
              }, trial.iti);
          };
          var leftKeyCode = trial.left_category_key;
          var rightKeyCode = trial.right_category_key;
          // function to handle responses by the subject
          const after_response = (info) => {
              var wImg = document.getElementById("wrongImgContainer");
              // after a valid response, the stimulus will have the CSS class 'responded'
              // which can be used to provide visual feedback that a response was recorded
              display_element.querySelector("#jspsych-iat-stim").className += " responded";
              // only record the first response
              if (response.key == null) {
                  response.key = info.key;
                  response.rt = info.rt;
              }
              response.rt_last_response = info.rt;

              if (trial.stim_key_association == "right") {
                  if (response.rt !== null &&
                      this.jsPsych.pluginAPI.compareKeys(response.key, rightKeyCode)) {
                      response.correct = true;
                      if (trial.response_ends_trial) {
                          end_trial();
                      }
                  }
                  else {
                      response.correct = false;
                      if (!trial.response_ends_trial && trial.display_feedback == true) {
                          wImg.style.visibility = "visible";
                      }
                      if (trial.response_ends_trial && trial.display_feedback == true) {
                          wImg.style.visibility = "visible";
                          if (trial.force_correct_key_press) {
                            if (is_first_response) {
                                this.jsPsych.pluginAPI.getKeyboardResponse({
                                    callback_function: end_trial,
                                    valid_responses: [trial.right_category_key],
                                });
                                is_first_response = false;
                            }
                          }
                          else {
                              this.jsPsych.pluginAPI.getKeyboardResponse({
                                  callback_function: end_trial,
                                  valid_responses: trial.key_to_move_forward,
                              });
                          }
                      }
                      else if (trial.response_ends_trial && trial.display_feedback != true) {
                          end_trial();
                      }
                      else if (!trial.response_ends_trial && trial.display_feedback != true) ;
                  }
              }
              else if (trial.stim_key_association == "left") {
                  if (response.rt !== null && this.jsPsych.pluginAPI.compareKeys(response.key, leftKeyCode)) {
                      response.correct = true;
                      if (trial.response_ends_trial) {
                          end_trial();
                      }
                  }
                  else {
                      response.correct = false;
                      if (!trial.response_ends_trial && trial.display_feedback == true) {
                          wImg.style.visibility = "visible";
                      }
                      if (trial.response_ends_trial && trial.display_feedback == true) {
                          wImg.style.visibility = "visible";
                          if (trial.force_correct_key_press) {
                            if (is_first_response) {
                              this.jsPsych.pluginAPI.getKeyboardResponse({
                                  callback_function: end_trial,
                                  valid_responses: [trial.left_category_key],
                              });
                              is_first_response = false;
                            }
                          }
                          else {
                              this.jsPsych.pluginAPI.getKeyboardResponse({
                                  callback_function: end_trial,
                                  valid_responses: trial.key_to_move_forward,
                              });
                          }
                      }
                      else if (trial.response_ends_trial && trial.display_feedback != true) {
                          end_trial();
                      }
                      else if (!trial.response_ends_trial && trial.display_feedback != true) ;
                  }
              }
          };
          // start the response listener
          if (trial.left_category_key != "NO_KEYS" && trial.right_category_key != "NO_KEYS") {
              var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: after_response,
                  valid_responses: [trial.left_category_key, trial.right_category_key],
                  rt_method: "performance",
                  persist: true,
                  allow_held_key: false,
              });
          }
          // end trial if time limit is set
          if (trial.trial_duration !== null && trial.response_ends_trial != true) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  end_trial();
              }, trial.trial_duration);
          }
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const key = this.jsPsych.pluginAPI.getValidKey([
              trial.left_category_key,
              trial.right_category_key,
          ]);
          const correct = trial.stim_key_association == "left"
              ? key == trial.left_category_key
              : key == trial.right_category_key;
          const default_data = {
              stimulus: trial.stimulus,
              response: key,
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
              correct: correct,
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          if (data.response !== null) {
              this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
          }
          const cont_rt = data.rt == null ? trial.trial_duration : data.rt;
          if (trial.force_correct_key_press) {
              if (!data.correct) {
                  this.jsPsych.pluginAPI.pressKey(trial.stim_key_association == "left" ? trial.left_category_key : trial.right_category_key, cont_rt + this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true));
              }
          }
          else {
              this.jsPsych.pluginAPI.pressKey(this.jsPsych.pluginAPI.getValidKey(trial.key_to_move_forward), cont_rt + this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true));
          }
      }
  }
  IatHtmlPlugin.info = info;

  return IatHtmlPlugin;

})(jsPsychModule);
