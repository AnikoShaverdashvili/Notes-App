using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesAPI.Data;
using NotesAPI.Models.Entities;
using System.Security.AccessControl;

namespace NotesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : Controller
    {
        private readonly NotesDbContext _notesDbContext;
        public NotesController(NotesDbContext notesDbContext) 
        {
            _notesDbContext = notesDbContext;
        }

        [HttpGet]   
        public async Task<IActionResult> GetAllNotes()
        {
            return Ok(await _notesDbContext.Notes.ToListAsync());
        }

        [HttpGet]
        [Route("{id}")]
        [ActionName("GetNotesById")]

        public async Task<IActionResult> GetNotesById([FromRoute]Guid id)
        {
            var note = await _notesDbContext.Notes.FindAsync(id);
            if(note== null)
            {
                return NotFound();
            }
            return Ok(note);


        }

        [HttpPost]
        public async Task<IActionResult> AddNote(Note note)
        {
            note.Id = Guid.NewGuid();
            await _notesDbContext.AddAsync(note);
            await _notesDbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNotesById), new { id = note.Id }, note);


        }

        [HttpPut]
        [Route("{id}")]

        public async Task<IActionResult>UpdateNote([FromRoute]Guid id, [FromBody] Note updatedNote)
        {
            var existingNote = await _notesDbContext.Notes.FindAsync(id);
            if(existingNote == null)
            {
                return NotFound();  
            }
            existingNote.Title=updatedNote.Title;
            existingNote.Description=updatedNote.Description;
            existingNote.IsVisible=updatedNote.IsVisible;

            await _notesDbContext.SaveChangesAsync();

             return Ok(existingNote);

        }
        [HttpDelete]
        [Route("{id}")]

        public async Task<IActionResult> DeleteNote([FromRoute] Guid id)
        {
            var existingNote = await _notesDbContext.Notes.FindAsync(id);
            if (existingNote == null)
            {
                return NotFound();
            }
            _notesDbContext.Notes.Remove(existingNote);
            await _notesDbContext.SaveChangesAsync();
            return Ok();

        }

        [HttpDelete]

        public async Task<IActionResult> DeleteAllNotes()
        {
            try
            {
                var notes = await _notesDbContext.Notes.ToListAsync();
                _notesDbContext.Notes.RemoveRange(notes);
                await _notesDbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }   

    }
}
