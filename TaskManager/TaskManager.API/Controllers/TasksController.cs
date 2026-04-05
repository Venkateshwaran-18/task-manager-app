using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TaskManager.API.Controllers;


[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();

        var tasks = await _context.Tasks
        .Where(t => t.UserId == userId)
        .ToListAsync();
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TaskItem task)
    {
        task.UserId = GetUserId();

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var userId = GetUserId();

        var task = await _context.Tasks
       .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null) return NotFound();

        task.IsCompleted = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();

        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userId);
    }
}