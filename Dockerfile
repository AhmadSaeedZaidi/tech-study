FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY js/projects/colour_changer   /usr/share/nginx/html/colour_changer
COPY js/projects/bmi_calculator    /usr/share/nginx/html/bmi_calculator
COPY js/projects/digital_clock     /usr/share/nginx/html/digital_clock
COPY js/projects/guess_the_number  /usr/share/nginx/html/guess_the_number
COPY js/projects/counter_app        /usr/share/nginx/html/counter_app
COPY js/projects/todo_list          /usr/share/nginx/html/todo_list
COPY js/projects/quiz_app           /usr/share/nginx/html/quiz_app
