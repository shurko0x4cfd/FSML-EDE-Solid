
import './FSMLConsole.css';
import { createSignal } from "solid-js";
import { get_fsml_instance } from 'fsmlang';


const ONLY = 0;

const fsml = get_fsml_instance();
const item_separator = " -> ";


const [log_text, set_log_text] = createSignal('');
const send_news = news => set_log_text(log_text() + news);

export const FSMLConsole = () =>
	<div className='fsml-console'>
		<Fsmlogo />
		<Fsmlog text={log_text()} />
		<Inbox {...{send_news}} />
	</div>;


const logo_text =
	"\n\
	==========================================================\n\
                                FSML                          \n\
	==========================================================\n\
	\n\
	FSML 0.4.1, (c) 2021, 2023 Alexander (Shurko) Stadnichenko\n\
	Type 'help' to FSML help you,\n\
	'license' to view BSD license, 'bb' to farewell\n";


const Fsmlogo = () =>
	<div className='fsmlogo-wrapper'>
		<div className='fsmlogo ws-pre'>
			{logo_text}
		</div>
	</div>;


const Fsmlog = props =>
	<div className='fsmlog ws-pre' children={props.text} />;


const [text_inbox, set_text_inbox] = createSignal('');

const enter_handler = (evt, send_news) => //
{
	evt.preventDefault();

	const scroll_amount       = 1000;
	const delay_before_scroll = 200;
	const inbox_text          = text_inbox() || '';
	const eval_result         = fsml.eval(inbox_text) || '';
	const stack               = fsml.stack.type() || '';

	let logtext = inbox_text ? '\n\n' + inbox_text : '';
	logtext += eval_result ? '\n\n' + eval_result : '';
	logtext += '\n\n' + '[' + fsml.stack.depth() + ']  ';
	logtext += stack.length ? stack.join(item_separator) : '';

	set_text_inbox('');
	send_news(logtext);

	/* Scroll for show prompt */
	const show_prompt = () =>
		document.getElementsByClassName('fsml-console')[ONLY]
			.scrollBy(0, scroll_amount);

	setTimeout(show_prompt, delay_before_scroll);
};

const change_handler = evt => set_text_inbox(evt.target.value);

const Inbox = props =>
	<div className='inbox-wrapper'>
		<div className='prompt'>{'fsml >'}</div>

		<form className='inputform' onSubmit={evt => enter_handler(evt, props.send_news)} >
			<input onChange={change_handler}
				name='inbox' 
				className='inbox'
				autoFocus
				value={text_inbox()} />
		</form>
	</div>;
