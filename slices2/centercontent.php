			<p><strong>3 column layout (This layout has content first (unlike my other demos) - and is based on an idea by <a href="http://www.positioniseverything.net/temp/piefecta-beta.html">BigJohn</a> which uses similar techniques to mine.)</strong></p>
			<p>Any column can be the longest. Footer will stay at bottom of window unless content is greater then it stays at bottom of document. This layout is a little bit temperamental and the negative margins are the key to keeping it solid.</p>
			<p>Only tested on PC (IE5, 5.5 , 6, Mozilla 1.3+ , Firebird 0.6.1, Opera7,Netscape 6.2). Opera doesn't like the footer but it's usable. ie5 mac will not like the footer either due to the 100% height on html,body .</p>
			<p>The left and right column colours are the background showing through. A different left column background colour can be achieved by using a repeating image on the left side of the body as in this example.</p>
			<p>There is nothing special about this demo as similar techniques have been used before, however they are not usually integrated into one example. The secret to this demo is the left and right columns which are floated negatively from the centre container. If you float them completely in the gaps at the side then they don't clear the footer. However
				if you leave them overlapping the centre content by 1 pixel then the footer is pushed down as required. Or you can float them completely to the side and just add some padding bottom to the columns to clear the footer.</p>
