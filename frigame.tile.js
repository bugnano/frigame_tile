/*global friGame */
/*jslint white: true, browser: true */

// Copyright (c) 2011-2014 Franco Bugnano

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Uses ideas and APIs inspired by:
// gameQuery Copyright (c) 2008 Selim Arsever (gamequery.onaluf.org), licensed under the MIT

(function (fg) {
	'use strict';

	// ******************************************************************** //
	// ******************************************************************** //
	// ******************************************************************** //
	// ******************************************************************** //
	// ******************************************************************** //

	fg.PTilemap = Object.create(fg.PSpriteGroup);
	fg.extend(fg.PTilemap, {
		init: function (name, tileDescription, animationList, options, parent) {
			var
				my_options,
				new_options = options || {},
				sizex = tileDescription.sizex,
				sizey = tileDescription.sizey,
				tileWidth = tileDescription.tileWidth,
				tileHeight = tileDescription.tileHeight,
				data = tileDescription.data,
				len_data = data.length,
				animation_options,
				sprite_options,
				sprite_name,
				sprite_obj,
				row = 0,
				col = 0,
				left = 0,
				top = 0,
				i
			;

			// tileDescription
			// {
			// sizex: 8 # Num tiles
			// sizey: 8 # Num tiles
			// tileWidth: 100 # Pixel
			// tileHeight: 50 # Pixel
			// data: [1,0,0,0,0,0,0,3,] # (sizex * sizey) members, indices of animationList
			// }

			// animationList
			// {
			// 1: {animation: name} # The object literal passed to setAnimation (MUST have at least animation: name)
			// 3: {animation: name} # The object literal passed to setAnimation (MUST have at least animation: name)
			// }

			// sprite_name
			// name + '_' + row + '_' + col

			if (this.options) {
				my_options = this.options;
			} else {
				my_options = {};
				this.options = my_options;
			}

			new_options.width = sizex * tileWidth;
			new_options.height = sizey * tileHeight;

			fg.PSpriteGroup.init.call(this, name, new_options, parent);

			for (i = 0; i < len_data; i += 1) {
				animation_options = animationList[data[i]];
				if (animation_options) {
					sprite_options = Object.create(animation_options);
					sprite_options.left = left;
					sprite_options.top = top;

					sprite_name = [name, row, col].join('_');

					this.addSprite(sprite_name, sprite_options);

					if (animation_options.createCallback) {
						sprite_obj = fg.s[sprite_name];
						animation_options.createCallback.call(sprite_obj, sprite_obj);
					}
				}

				left += tileWidth;
				col += 1;
				if (col >= sizex) {
					col = 0;
					left = 0;
					row += 1;
					top += tileHeight;
				}
			}
		}
	});

	fg.Tilemap = fg.Maker(fg.PTilemap);

	fg.extend(fg.PSpriteGroup, {
		addTilemap: function (name, tileDescription, animationList, options) {
			var
				tilemap = fg.Tilemap(name, tileDescription, animationList, options, this.name)
			;

			this.layers.push({name: name, obj: tilemap});
			this.updateList.push({name: name, obj: tilemap});

			return tilemap;
		},

		insertTilemap: function (name, tileDescription, animationList, options) {
			var
				tilemap = fg.Tilemap(name, tileDescription, animationList, options, this.name)
			;

			this.layers.unshift({name: name, obj: tilemap});
			this.updateList.unshift({name: name, obj: tilemap});

			return tilemap;
		}
	});
}(friGame));

